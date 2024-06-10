import { useRef, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { GrFormPrevious } from 'react-icons/gr';
import { MdNavigateNext } from 'react-icons/md';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Mousewheel, Keyboard, Autoplay, FreeMode } from 'swiper/modules';

import './Slider.scss';
import * as siteService from '../../services/siteService';

const ENV = import.meta.env;

export default function Slider({ setImgTwo, setImgThree }) {
    const navigationPrevRef = useRef(null);
    const navigationNextRef = useRef(null);
    const [listSlider, setListSlider] = useState([]);

    useEffect(() => {
        // Bắt buộc Swiper cập nhật các nút điều hướng sau khi chúng được mount
        const timeoutId = setTimeout(() => {
            if (navigationPrevRef.current && navigationNextRef.current) {
                navigationPrevRef.current.classList.add('swiper-button-prev');
                navigationNextRef.current.classList.add('swiper-button-next');
            }
        }, 0);

        return () => clearTimeout(timeoutId);
    }, []);

    useEffect(() => {
        const fetchListSlider = async () => {
            const res = await siteService.getAllSlider();

            if (res && res.errCode === 0) {
                setListSlider(res.data);
            }
        };

        fetchListSlider();
    }, []);

    useEffect(() => {
        if (listSlider.length) {
            const imgTwoItem = listSlider.find((item) => item.status === true && item.position === 2);
            const imgThreeItem = listSlider.find((item) => item.status === true && item.position === 3);

            if (imgTwoItem) setImgTwo(imgTwoItem);
            if (imgThreeItem) setImgThree(imgThreeItem);
        }
    }, [listSlider, setImgTwo, setImgThree]);

    return (
        <>
            <Swiper
                cssMode={true}
                navigation={{
                    prevEl: navigationPrevRef.current,
                    nextEl: navigationNextRef.current,
                }}
                pagination={{
                    enabled: true,
                }}
                loop={true}
                mousewheel={true}
                keyboard={true}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }}
                modules={[Navigation, Pagination, Mousewheel, Keyboard, Autoplay, FreeMode]}
                className="mySwiper"
                onSwiper={(swiper) => {
                    // Cập nhật các nút điều hướng của Swiper khi chúng sẵn sàng
                    swiper.navigation.init();
                    swiper.navigation.update();
                }}
            >
                {listSlider?.map((item, index) => {
                    if (item.status === true && item.position === 1) {
                        return (
                            <SwiperSlide key={index}>
                                <Link to={item.url} style={{ width: '100%', height: '100%' }}>
                                    <img
                                        src={`${ENV.VITE_BASE_URL_BACKEND}/images/sliders/${item.filename}`}
                                        style={{ width: '100%', height: '100%' }}
                                        // alt={item.alt}
                                    />
                                </Link>
                            </SwiperSlide>
                        );
                    }
                    return null;
                })}

                <div ref={navigationPrevRef} className="custom-nav prev">
                    <GrFormPrevious />
                </div>
                <div ref={navigationNextRef} className="custom-nav next">
                    <MdNavigateNext />
                </div>
            </Swiper>
        </>
    );
}
