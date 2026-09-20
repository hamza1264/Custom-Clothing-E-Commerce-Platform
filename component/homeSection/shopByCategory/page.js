import Image from 'next/image';
import Link from 'next/link';
import "./shopByCategory.css"

export default function Home() {
    // Category Data Array
    const categories = [
        {
            id: 1,
            title: 'Unstitched',
            itemsCount: '120+ Items',
            image: '/femail01.jpg',
            link: '/shop/unstitched',
        },
        {
            id: 2,
            title: '3 Piece Suits',
            itemsCount: '180+ Items',
            image: '/femail02.jpg',
            link: '/shop/3-piece-suits',
        },
        {
            id: 3,
            title: '2 Piece Suits',
            itemsCount: '150+ Items',
            image: '/femail03.jpg',
            link: '/shop/2-piece-suits',
        },
        {
            id: 4,
            title: 'Pret Collection',
            itemsCount: '100+ Items',
            image: '/femail04.jpg',
            link: '/shop/pret-collection',
        },
        {
            id: 5,
            title: 'Luxury Formals',
            itemsCount: '80+ Items',
            image: '/femail05.jpg',
            link: '/shop/luxury-formals',
        },
        {
            id: 6,
            title: 'Accessories',
            itemsCount: '60+ Items',
            image: '/femail06.jpg',
            link: '/shop/accessories',
        },
    ];

    return (
        <div className="container">
            {/* SHOP BY CATEGORY SECTION */}
            <section className="category-section">
                {/* Section Header */}
                <div className="category-header">
                    <div>
                        <h2 className="category-title">Shop by Category</h2>
                        <p className="category-subtitle">Explore our wide range of collections</p>
                    </div>
                    <Link href="/shop" className="view-all-btn">
                        View All
                    </Link>
                </div>

                {/* Category Cards Grid */}
                <div className="category-grid">
                    {categories.map((cat) => (
                        <Link href={cat.link} key={cat.id} className="category-card">
                            <div className="category-image-wrapper">
                                <Image
                                    src={cat.image}
                                    alt={cat.title}
                                    width={200}
                                    height={260}
                                    className="category-image"
                                />
                            </div>
                            <div className="category-info">
                                <h3 className="category-name">{cat.title}</h3>
                                <span className="category-count">{cat.itemsCount}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}