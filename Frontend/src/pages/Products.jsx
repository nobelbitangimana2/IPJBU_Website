import React from 'react'
import { Link } from 'react-router-dom'
import Button   from '../components/Button'
import { useData } from '../store/DataContext'
import './Products.css'

export default function Products() {
  const { products } = useData()

  return (
    <div className="products-page">

      <div className="page-hero">
        <div className="container page-hero__inner">
          <span className="page-hero__label">From our farms</span>
          <h1 className="page-hero__title">Our Products</h1>
          <p className="page-hero__sub">
            Quality agricultural produce. Available in multiple packaging sizes for every need.
          </p>
        </div>
      </div>

      <section className="section section--cream">
        <div className="container">
          {products.length === 0 ? (
            <p className="products__loading">Loading products…</p>
          ) : (
            <div className="products__grid">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* Bulk CTA banner */}
      <section className="prod-cta">
        <div className="prod-cta__photo">
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&q=80"
          alt="Champ agro-pastoral"
            loading="lazy"
          />
        </div>
        <div className="prod-cta__text">
          <span className="section__label" style={{ color:'var(--green-light)' }}>Bulk Orders</span>
          <h2 className="prod-cta__title">Need a custom quote?</h2>
          <p className="prod-cta__sub">
            We supply traders, institutions, and organisations across the region.
            Contact us for wholesale pricing and delivery terms.
          </p>
          <Button to="/contact" size="lg">Request a Quote</Button>
        </div>
      </section>

    </div>
  )
}

function ProductCard({ product }) {
  const { name, description, imageUrl, sizes = [] } = product

  return (
    <article className="prod-card">
      <div className="prod-card__img-wrap">
        {imageUrl
          ? <img src={imageUrl} alt={name} className="prod-card__img" loading="lazy" />
          : <div className="prod-card__img-placeholder" aria-hidden="true">🌾</div>
        }
      </div>
      <div className="prod-card__body">
        <h3 className="prod-card__name">{name}</h3>
        {description && <p className="prod-card__desc">{description}</p>}

        {sizes.length > 0 && (
          <div className="prod-card__sizes">
            <p className="prod-card__sizes-label">Sizes &amp; Pricing</p>
            <table className="prod-card__table">
              <thead>
                <tr><th>Size</th><th>Price</th></tr>
              </thead>
              <tbody>
                {sizes.map(({ size, price }) => (
                  <tr key={size}>
                    <td><span className="prod-card__size-pill">{size}</span></td>
                    <td className="prod-card__price">
                      {price && price > 0
                        ? `$${Number(price).toLocaleString()}`
                        : <span className="prod-card__price--contact">Contact us</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Link to="/contact" className="prod-card__enquire">
          Enquire about this product →
        </Link>
      </div>
    </article>
  )
}
