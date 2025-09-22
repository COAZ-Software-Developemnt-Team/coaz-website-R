
const Banner = ({ title, subtitle, image }) => {
    return (
        <div
            className="relative h-60 flex items-center justify-center text-center text-white"
            style={{
                backgroundImage: `url(${image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div className="absolute inset-0 bg-[rgb(0,175,240)] z-0"></div>
            <div className="relative z-10 px-4">
                <h1 className="text-3xl md:text-5xl font-bold">{title}</h1>
                {subtitle && <p className="mt-2 text-lg md:text-xl">{subtitle}</p>}
            </div>
        </div>
    );
};

export default Banner;
