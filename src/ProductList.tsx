import React, {useEffect, useState} from 'react';
import './App.css';
import ProductDetail from "./ProductDetail";
import axios from 'axios';

function ProductList() {
    const [products, setProducts] = useState<{ id: string, name: string, price: string, picture: string, description: string }[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<{ id: string, name: string, price: string, picture: string, description: string }[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [hoveredProduct, setHoveredProduct] = useState<{ id: string, name: string; price: string; picture: string; description: string; } | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<{ id: string, name: string; price: string; picture: string; description: string; } | null>(null);
    const [showProductDetail, setShowProductDetail] = useState(false);

    const handleProductClick = (product: { id: string; name: string; price: string; picture: string; description: string; }) => {
        setSelectedProduct(product);
        setShowProductDetail(true);
    }

    useEffect(() => {
        axios.get('https://e0a28c60-4b05-422e-8c15-ec8d6ca9836c.mock.pstmn.io/products')
            .then((response) => {
                console.log("response.data")
                console.log(response.data)
                setProducts(response.data.map((p: { id: string, name: any; price: any; image: any; description: any; }) => ({
                    id: p.id,
                    name: p.name,
                    price: p.price,
                    picture: p.image,
                    description: p.description
                })));
                setFilteredProducts(response.data.map((p: { id: string, name: any; price: any; image: any; description: any; }) => ({
                    id: p.id,
                    name: p.name,
                    price: p.price,
                    picture: p.image,
                    description: p.description
                })));
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    useEffect(() => {
        return setFilteredProducts(
            products.filter(({name}) => name.toLowerCase().startsWith(searchTerm.toLowerCase()))
        );
    }, [searchTerm, products]);

    const handleDelete = (product: { id: string; name: string; price: string; picture: string; description: string; }, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        axios.delete(`https://e0a28c60-4b05-422e-8c15-ec8d6ca9836c.mock.pstmn.io/products/${product.id}`)
            .then((response) => {
                console.log(response);
                // Eliminar el producto de la lista de products
                const newProducts = products.filter((p) => p.id !== product.id);
                setProducts(newProducts);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    return (
        <div>
            <div className="input-group mb-3">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name"
                    className="form-control"
                />
                <div className="input-group-append">
                    <button className="btn btn-outline-secondary" type="submit">Search</button>
                </div>
            </div>
            {!showProductDetail && (
                <div className="row">
                    {filteredProducts.map((product, index) => (
                        <div className="col-4">
                            <div
                                className="card mb-3"
                                onMouseEnter={() => setHoveredProduct(product)}
                                onMouseLeave={() => setHoveredProduct(null)}
                                onClick={() => handleProductClick(product)}
                            >
                                <img src={product.picture} className="card-img-top" alt={product.name}/>
                                <div className="card-body">
                                    <h5 className="card-title">{product.name}</h5>
                                    <p className="card-text">{product.price}</p>
                                    <div className="d-flex justify-content-between align-items-center">
                                        {hoveredProduct === product && (
                                            <>
                                                <button onClick={(event) => handleDelete(product, event)} className="btn btn-danger">Delete</button>
                                                <p className="product-description">{product.description}</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {showProductDetail && selectedProduct &&
            <ProductDetail product={selectedProduct} onClose={() => setShowProductDetail(false)}/>}
        </div>
    );
}

export default ProductList;