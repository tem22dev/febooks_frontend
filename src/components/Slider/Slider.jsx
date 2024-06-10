import { useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { GrFormPrevious } from 'react-icons/gr';
import { MdNavigateNext } from 'react-icons/md';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Mousewheel, Keyboard, Autoplay, FreeMode } from 'swiper/modules';

import './Slider.scss';
import { Link } from 'react-router-dom';

export default function Slider() {
    const navigationPrevRef = useRef(null);
    const navigationNextRef = useRef(null);

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

    const listSlider = [
        {
            img: 'https://cdn0.fahasa.com/media/magentothem/banner7/DiamondSaiGonBook_0624_Slide_840x320__1.jpg',
            alt: 'anh 1',
            url: 'http://localhost:5173/#!',
        },
        {
            img: 'https://cdn0.fahasa.com/media/magentothem/banner7/Steam_T6_Slide_840x320_v2.jpg',
            alt: 'anh 2',
            url: 'http://localhost:5173/#!',
        },
        {
            img: 'https://cdn0.fahasa.com/media/magentothem/banner7/BachHoa_SlideBanner_840x320.jpg',
            alt: 'anh 3',
            url: 'http://localhost:5173/#!',
        },
        {
            img: 'https://cdn0.fahasa.com/media/magentothem/banner7/Bo0106__840x320_1.jpg',
            alt: 'anh 4',
            url: 'http://localhost:5173/#!',
        },
    ];

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
                {listSlider?.map((item, index) => (
                    <SwiperSlide key={index}>
                        <Link to={item.url} style={{ width: '100%', height: '100%' }}>
                            <img src={item.img} style={{ width: '100%', height: '100%' }} alt={item.alt} />
                        </Link>
                    </SwiperSlide>
                ))}

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
