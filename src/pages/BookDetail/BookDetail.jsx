import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { Row, Col, Rate, Divider } from 'antd';
import ImageGallery from 'react-image-gallery';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { BsCartPlus } from 'react-icons/bs';
import 'react-image-gallery/styles/scss/image-gallery.scss';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

import * as bookService from '../../services/bookService';
import styles from './BookDetail.module.scss';
import ModalGallery from './ModalGallery';
import BookLoader from './BookLoader';
import { doAddBookAction } from '../../redux/order/orderSlice';

const ENV = import.meta.env;

function BookDetail() {
    let location = useLocation();
    const navigate = useNavigate();
    const refGallery = useRef(null);
    const dispatch = useDispatch();

    const [images, setImages] = useState([]);
    const [dataBook, setDataBook] = useState();
    const [quantity, setQuantity] = useState(1);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isOpenModalGallery, setIsOpenModalGallery] = useState(false);

    let params = new URLSearchParams(location.search);
    let id = params?.get('id');

    useEffect(() => {
        fetchBook(id);
    }, [id]);
    const fetchBook = async (id) => {
        const res = await bookService.getBookById(id);
        const resSlider = await bookService.getSliderBookById(id);

        if (res && resSlider && res.data && resSlider.data) {
            const arrImages = [];
            if (res?.data?.thumbnail) {
                arrImages.push({
                    original: `${ENV.VITE_BASE_URL_BACKEND}/images/books/${res?.data?.thumbnail}`,
                    thumbnail: `${ENV.VITE_BASE_URL_BACKEND}/images/books/${res?.data?.thumbnail}`,
                    originalClass: 'original-image',
                    thumbnailClass: 'thumbnail-image',
                });
            }
            if (resSlider.data) {
                resSlider.data?.map((item) => {
                    arrImages.push({
                        original: `${ENV.VITE_BASE_URL_BACKEND}/images/books/${item.filename}`,
                        thumbnail: `${ENV.VITE_BASE_URL_BACKEND}/images/books/${item.filename}`,
                        originalClass: 'original-image',
                        thumbnailClass: 'thumbnail-image',
                    });
                });
            }

            setDataBook(res.data);
            setImages(arrImages);
        }
    };

    const handleOnClickImage = () => {
        //get current index onClick
        // alert(refGallery?.current?.getCurrentIndex());
        setIsOpenModalGallery(true);
        setCurrentIndex(refGallery?.current?.getCurrentIndex() ?? 0);
        // refGallery?.current?.fullScreen()
    };

    const handleAddToCart = (quantity, book) => {
        dispatch(doAddBookAction({ quantity, detail: book, id: book.id }));
    };

    const handleChangeButton = (type) => {
        if (type === 'MINUS') {
            if (quantity - 1 <= 0) return;
            setQuantity(quantity - 1);
        }
        if (type === 'PLUS') {
            if (quantity === +dataBook.quantityAvailable) return;
            setQuantity(quantity + 1);
        }
    };

    const handleChangeInput = (value) => {
        if (!isNaN(value)) {
            if (+value > 0 && +value < +dataBook.quantityAvailable) {
                setQuantity(+value);
            }
        }
    };

    return (
        <div style={{ background: '#efefef', padding: '20px 0' }}>
            <div
                className={clsx(styles.book)}
                style={{ maxWidth: 1440, margin: '0 auto', minHeight: 'calc(100vh - 150px)' }}
            >
                <div style={{ padding: '20px', background: '#fff', borderRadius: 5 }}>
                    {dataBook && dataBook.id && images.length !== 0 ? (
                        <Row gutter={[20, 20]}>
                            <Col md={10} sm={0} xs={0}>
                                <ImageGallery
                                    ref={refGallery}
                                    items={images}
                                    showPlayButton={false} //hide play button
                                    showFullscreenButton={false} //hide fullscreen button
                                    renderLeftNav={() => <></>} //left arrow === <> </>
                                    renderRightNav={() => <></>} //right arrow === <> </>
                                    slideOnThumbnailOver={true} //onHover => auto scroll images
                                    onClick={() => handleOnClickImage()}
                                />
                            </Col>
                            <Col md={14} sm={24}>
                                <Col md={0} sm={24} xs={24}>
                                    <ImageGallery
                                        ref={refGallery}
                                        items={images}
                                        showPlayButton={false} //hide play button
                                        showFullscreenButton={false} //hide fullscreen button
                                        renderLeftNav={() => <></>} //left arrow === <> </>
                                        renderRightNav={() => <></>} //right arrow === <> </>
                                        showThumbnails={false}
                                    />
                                </Col>
                                <Col span={24}>
                                    {dataBook?.authorID && (
                                        <div className={clsx(styles.author)}>
                                            Tác giả: <a href="#">{dataBook?.authorID}</a>{' '}
                                        </div>
                                    )}
                                    <div className={clsx(styles.title)}>{dataBook?.title}</div>
                                    <div className={clsx(styles.rating)}>
                                        <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 12 }} />
                                        <span className={clsx(styles.sold)}>
                                            <Divider type="vertical" />
                                            {dataBook?.quantitySold}
                                        </span>
                                    </div>
                                    <div className={clsx(styles.price)}>
                                        <span className={clsx(styles.currency)}>
                                            {new Intl.NumberFormat('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND',
                                            }).format(dataBook?.price)}
                                        </span>
                                    </div>
                                    <div className={clsx(styles.delivery)}>
                                        <div>
                                            <span className={clsx(styles.left)}>Vận chuyển</span>
                                            <span className={clsx(styles.right)}>Miễn phí vận chuyển</span>
                                        </div>
                                    </div>
                                    <div className={clsx(styles.quantity)}>
                                        <span className={clsx(styles.left)}>Số lượng</span>
                                        <span className={clsx(styles.right)}>
                                            <button onClick={() => handleChangeButton('MINUS')}>
                                                <MinusOutlined />
                                            </button>
                                            <input
                                                value={quantity}
                                                min={1}
                                                onChange={(e) => handleChangeInput(e.target.value)}
                                            />
                                            <button onClick={() => handleChangeButton('PLUS')}>
                                                <PlusOutlined />
                                            </button>
                                        </span>
                                    </div>
                                    <div className={clsx(styles.buy)}>
                                        <button
                                            className={clsx(styles.cart)}
                                            onClick={() => handleAddToCart(quantity, dataBook)}
                                        >
                                            <BsCartPlus className={clsx(styles.icon_cart)} />
                                            <span>Thêm vào giỏ hàng</span>
                                        </button>
                                        <button
                                            className={clsx(styles.now)}
                                            onClick={() => {
                                                handleAddToCart(quantity, dataBook);
                                                navigate('/book/order');
                                            }}
                                        >
                                            Mua ngay
                                        </button>
                                    </div>
                                </Col>
                            </Col>
                        </Row>
                    ) : (
                        <BookLoader />
                    )}
                </div>
            </div>
            <ModalGallery
                isOpen={isOpenModalGallery}
                setIsOpen={setIsOpenModalGallery}
                currentIndex={currentIndex}
                items={images}
                title={dataBook?.title}
            />
        </div>
    );
}

export default BookDetail;
