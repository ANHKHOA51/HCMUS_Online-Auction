import Form from 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import InputGroup from 'react-bootstrap/InputGroup'
import { formatPrice } from '../utils/formatCurrency'
import Editor from './Editor'
import { useState } from 'react';
import useAddProduct from '../hooks/product/useAddProduct';
import { useProducts } from '../hooks/useProduct';
import Alert from 'react-bootstrap/Alert';

import Dashboard from '@uppy/react/dashboard';

import '@uppy/core/css/style.min.css'
import '@uppy/dashboard/css/style.min.css'

export default function AddProductForm() {
    const {
        uppy,
        quillRef,
        formData,
        price,
        errors,
        handleSubmit,
        onTextChange,
        onPriceChange,
        onPriceKeyDown,
    } = useAddProduct();

    const { categories } = useProducts()



    return (
        <div className='d-flex justify-content-center align-items-center'>
            <Form className='w-50' method='post' id='addProductForm' action="" onSubmit={handleSubmit}>
                <Card>
                    <Card.Header>Thêm sản phẩm</Card.Header>
                    <Card.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Tên sản phẩm</Form.Label>
                            <Form.Control type="text" className="form-control" id="name" name="name"
                                onChange={onTextChange}
                                value={formData.name}
                                isInvalid={!!errors.name}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.name}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Loại sản phẩm</Form.Label>
                            <Form.Select
                                id="category_id"
                                name="category_id"
                                className="form-select"
                                value={formData.category_id}
                                onChange={onTextChange}
                            >
                                <option value={null}>---Chọn loại sản phẩm---</option>

                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Row>
                                <Col>
                                    <Form.Label>Giá khởi điểm</Form.Label>
                                    <InputGroup>
                                        <Form.Control type="text"
                                            id="starting_price"
                                            name="starting_price"
                                            value={formatPrice(price.starting_price)}
                                            onChange={onPriceChange}
                                            onKeyDown={onPriceKeyDown}
                                            isInvalid={!!errors.starting_price}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.starting_price}
                                        </Form.Control.Feedback>
                                        <InputGroup.Text>₫</InputGroup.Text>
                                    </InputGroup>
                                </Col>
                                <Col>
                                    <Form.Label>Bước giá</Form.Label>
                                    <InputGroup>
                                        <Form.Control type="text" id="step_price" name="step_price"
                                            value={formatPrice(price.step_price)}
                                            onChange={onPriceChange}
                                            onKeyDown={onPriceKeyDown}
                                            isInvalid={!!errors.step_price}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.step_price}
                                        </Form.Control.Feedback>
                                        <InputGroup.Text>₫</InputGroup.Text>
                                    </InputGroup>
                                </Col>
                                <Col>
                                    <Form.Label>Giá mua ngay</Form.Label>
                                    <InputGroup>
                                        <Form.Control type="text" id="buy_now_price" name="buy_now_price"
                                            value={formatPrice(price.buy_now_price)}
                                            onChange={onPriceChange}
                                            onKeyDown={onPriceKeyDown}
                                        />
                                        <InputGroup.Text>₫</InputGroup.Text>
                                    </InputGroup>
                                </Col>
                            </Row>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Row>
                                <Col>
                                    <Form.Label>Thời gian bắt đầu</Form.Label>
                                    <InputGroup>
                                        <Form.Control type="datetime-local"
                                            id="start_time"
                                            name="start_time"
                                            value={formData.start_time}
                                            onChange={onTextChange}
                                            isInvalid={!!errors.start_time}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.start_time}
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                </Col>
                                <Col>
                                    <Form.Label>Thời gian kết thúc</Form.Label>
                                    <InputGroup>
                                        <Form.Control type="datetime-local" id="end_time" name="end_time"
                                            value={formData.end_time}
                                            onChange={onTextChange}
                                            isInvalid={!!errors.end_time}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.end_time}
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                </Col>
                            </Row>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Mô tả</Form.Label>
                            <Editor ref={quillRef} />
                        </Form.Group>

                        <Form.Group className='mb-3'>
                            <Form.Label >Ảnh</Form.Label>
                            <Form.Control type="hidden" id="photos" name="photos" isInvalid={!!errors.photos} />
                            <Dashboard uppy={uppy} width="100%" height="300px" />
                            <Form.Control.Feedback type="invalid">
                                {errors.photos}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Check type="checkbox" id="auto_extend" label="Tự động gia hạn" name="auto_extend"
                            checked={formData.auto_extend}
                            onChange={onTextChange} />

                        {errors.general && <Alert variant="danger">{errors.general}</Alert>}

                    </Card.Body>
                    <Card.Footer className="text-muted d-flex justify-content-end gap-3">
                        <button type="submit" className="btn btn-primary">
                            <i className="bi bi-check2"></i>
                            Save
                        </button>
                        <a href="/admin/products" className="btn btn-outline-success">
                            <i className="bi bi-arrow-left"></i>
                            Back
                        </a>
                    </Card.Footer>
                </Card>
            </Form>
        </div>
    )
}