import './style.css'

export default function Header() {
    return (
        <nav className="navbar sticky-top navbar-expand-lg navbar-dark" style={{backgroundColor: "#094067"}}>
            <div className="container">
                <a className="navbar-brand fs-4" href="/">
                    <img
                        src="logo.png"
                        alt="Logo"
                        width="60"
                        height="60"
                        className="d-inline-block align-text-center me-2"
                    />
                    ONLINE AUCTION
                </a>

                <div className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item ">
                        <a className="nav-link active" aria-current="page" aria-expanded="false" href="/">Home</a>
                    </li>
                    <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Categories
                        </a>
                        <ul className="dropdown-menu" style={{backgroundColor: "#094067"}}>
                            <li><a className="dropdown-item item_in_list" href="#">Action</a></li>
                            <li><a className="dropdown-item item_in_list" href="#">Another action</a></li>
                            <li><hr className="dropdown-divider" style={{ borderColor: 'white' }}/></li>
                            <li><a className="dropdown-item item_in_list" href="#">All</a></li>
                        </ul>
                    </li>
                </div>

                <div className="navbar-nav">
                    <form className="d-flex" role="search">
                        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                        <button className="btn btn-outline-success" type="submit">Search</button>
                    </form>
                    <li className="nav-item ps-2">
                        <a className="nav-link" aria-current="page" href="#">Đăng nhập</a>
                    </li>
                </div>

            </div>
        </nav>
    )
}