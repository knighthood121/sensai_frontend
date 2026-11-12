import { ArrowUpRight, Heart, Loader2, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductImage from '../../../components/common/ProductImage';
import { getCatalogImage, getCatalogPrice, getCatalogStock } from '../../../utils/catalogProduct';
import type { Product } from '../../../types/Product.type';
import { getCategoryColorStyle } from '../../../utils/categoryColors';

type Props = {
  product: Product;
  adding: boolean;
  saving: boolean;
  saved: boolean;
  onAddToCart: () => void;
  onWishlist: () => void;
};

export default function CatalogProductRow({ product, adding, saving, saved, onAddToCart, onWishlist }: Props) {
  const price = getCatalogPrice(product);
  const stock = getCatalogStock(product);
  const path = `/product/${product.id}`;
  const data = [['Brand', product.brand], ['Material', product.material], ['Finish', product.finish]].filter(([, value]) => value);

  return <article className="catalog-row" aria-label={product.name} style={getCategoryColorStyle(product.categoryId ?? product.category?.id)}>
    <div className="catalog-row__identity">
      <Link to={path} className="catalog-row__image" aria-label={`View ${product.name}`}><ProductImage src={getCatalogImage(product)} alt={product.name} /></Link>
      <div className="catalog-row__name">
        {product.category && <Link className="catalog-row__category" to={`/category/${product.category.slug}`}>{product.category.name}</Link>}
        <h2><Link to={path}>{product.name}</Link></h2>
        <p className="catalog-row__sku">SKU <span>{product.sku || 'Unavailable'}</span></p>
        {product.subCategory && <p className="catalog-row__type">{product.subCategory.name}</p>}
      </div>
    </div>
    <div className="catalog-row__cell catalog-row__data">
      <p className="catalog-row__column-label">Product data</p>
      {data.length ? <dl>{data.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl> : <p className="catalog-row__muted">Details on request</p>}
    </div>
    <div className="catalog-row__cell catalog-row__specifications">
      <p className="catalog-row__column-label">Specifications</p>
      <dl>
        {product.dimensions && <div><dt>Dimensions</dt><dd>{product.dimensions}</dd></div>}
        {product.packQuantity > 0 && <div><dt>Pack quantity</dt><dd>{product.packQuantity}{product.unitOfMeasure ? ` ${product.unitOfMeasure}` : ''}</dd></div>}
      </dl>
      <Link to={path} className="catalog-row__details">View specifications <ArrowUpRight size={13} aria-hidden="true" /></Link>
    </div>
    <div className="catalog-row__cell catalog-row__pricing">
      <p className="catalog-row__column-label">Price &amp; availability</p>
      <p className="catalog-row__price">{price === null ? 'Price on request' : price.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 })}</p>
      <p className={`catalog-row__stock${stock === 0 ? ' is-unavailable' : ''}`}>{stock === null ? 'Availability on request' : stock === 0 ? 'Out of stock' : `${stock} available`}</p>
    </div>
    <div className="catalog-row__cell catalog-row__actions">
      <button type="button" className={`catalog-row__wishlist${saved ? ' is-saved' : ''}`} onClick={onWishlist} disabled={saving} aria-label={`${saved ? 'Remove' : 'Add'} ${product.name} ${saved ? 'from' : 'to'} wishlist`} aria-pressed={saved}>
        {saving ? <Loader2 size={15} className="animate-spin" aria-hidden="true" /> : <Heart size={15} fill={saved ? 'currentColor' : 'none'} aria-hidden="true" />}{saved ? 'Saved to wishlist' : 'Add to wishlist'}
      </button>
      <button type="button" className="catalog-row__cart" onClick={onAddToCart} disabled={adding || stock === 0}>
        {adding ? <Loader2 size={15} className="animate-spin" aria-hidden="true" /> : <ShoppingCart size={15} aria-hidden="true" />}{adding ? 'Adding...' : stock === 0 ? 'Out of stock' : product.variants?.length > 1 ? 'Choose options' : 'Add to cart'}
      </button>
    </div>
  </article>;
}
