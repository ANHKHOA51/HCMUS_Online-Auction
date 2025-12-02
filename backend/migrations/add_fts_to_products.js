export async function up(knex) {
    // Thêm tsvector column cho full text search
    await knex.schema.table('products', table => {
        // Tsvector column để store full text search data
        table.specificType('search_vector', 'tsvector');
    });

    // Tạo index trên search_vector
    await knex.raw(`
        CREATE INDEX search_vector_idx ON products USING gin(search_vector)
    `);

    // Tạo trigger function để tự động update search_vector khi insert/update
    await knex.raw(`
        CREATE OR REPLACE FUNCTION products_search_vector_update() RETURNS TRIGGER AS $$
        BEGIN
            NEW.search_vector := to_tsvector('simple', COALESCE(NEW.name, '') || ' ' || COALESCE(NEW.description, ''));
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
    `);

    // Tạo trigger
    await knex.raw(`
        DROP TRIGGER IF EXISTS products_search_vector_trigger ON products;
        CREATE TRIGGER products_search_vector_trigger
        BEFORE INSERT OR UPDATE ON products
        FOR EACH ROW
        EXECUTE FUNCTION products_search_vector_update();
    `);

    // Update search_vector cho những records cũ
    await knex.raw(`
        UPDATE products 
        SET search_vector = to_tsvector('simple', COALESCE(name, '') || ' ' || COALESCE(description, ''))
    `);
}

export async function down(knex) {
    // Drop trigger
    await knex.raw(`
        DROP TRIGGER IF EXISTS products_search_vector_trigger ON products
    `);

    // Drop function
    await knex.raw(`
        DROP FUNCTION IF EXISTS products_search_vector_update()
    `);

    // Drop index
    await knex.raw(`
        DROP INDEX IF EXISTS search_vector_idx
    `);

    // Drop column
    await knex.schema.table('products', table => {
        table.dropColumn('search_vector');
    });
}
