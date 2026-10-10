import { Icon, Button, IconButton, Badge } from '../ds.js';
import { Section, AssetTile, AssetGrid, assetArt } from '../ui/kit.jsx';
import { money } from '../data.js';
import { useStore, go } from '../store.jsx';

/* One saved item: the shared tile plus a row to act on it right here. */
function SavedItem({ a, i }) {
  const s = useStore();
  const owned = s.owns(a.id), inCart = s.inCart(a.id);
  return (
    <li className="saved-item" style={{ '--i': i }}>
      <AssetTile a={a} />
      <div className="saved-item__bar">
        {owned ? <Badge variant="success" icon="checkmark-circle-02">Owned</Badge>
          : <span className="saved-item__price mds-num">{a.price ? 'Personal license' : 'Free download'}</span>}
        <span className="saved-item__acts">
          {owned ? <Button size="sm" variant="secondary" leadingIcon="download-01" onClick={() => s.toast('Download started', { variant: 'success' })}>Download</Button>
            : inCart ? <Button size="sm" variant="tertiary" leadingIcon="tick-02" onClick={() => s.openCart()}>In cart</Button>
              : <Button size="sm" variant="secondary" leadingIcon="shopping-cart-01" onClick={() => a.price ? s.addToCart(a.id, 'personal') : s.claimFree(a.id)}>{a.price ? 'Add to cart' : 'Get it free'}</Button>}
          <IconButton size="sm" icon="cancel-01" label={'Remove ' + a.title + ' from saved'} onClick={() => s.toggleSave(a.id)} />
        </span>
      </div>
    </li>
  );
}

/* Empty board: three colorful previews fanned out, springing open on hover. */
function EmptyBoard({ picks }) {
  return (
    <div className="saved-empty">
      <div className="saved-fan" aria-hidden="true">
        {picks.slice(0, 3).map((a, i) => <img key={a.id} src={assetArt(a)} alt="" className={'saved-fan__card saved-fan__card--' + i} />)}
        <span className="saved-fan__heart"><Icon name="favourite" variant="twotone" size={24} /></span>
      </div>
      <h2 className="saved-empty__title">Nothing saved yet</h2>
      <p className="saved-empty__body">Tap the heart on any kit, font or icon set and it lands here. Think of it as your moodboard, minus the screenshots folder.</p>
      <Button size="lg" leadingIcon="store-01" onClick={() => go('shop')}>Browse the shop</Button>
    </div>
  );
}

function Saved() {
  const s = useStore();
  const items = s.saved.map(id => s.asset(id)).filter(Boolean);
  const movable = items.filter(a => !s.owns(a.id));
  const toAdd = movable.filter(a => !s.inCart(a.id));
  const worth = movable.reduce((n, a) => n + (a.price || 0), 0);
  const popular = s.allAssets.filter(a => !s.saved.includes(a.id)).sort((x, y) => (y.sales || 0) - (x.sales || 0)).slice(0, 4);

  function moveAll() {
    const n = movable.length;
    s.addManyToCart(toAdd.map(a => ({ id: a.id, license: 'personal' })));
    movable.forEach(a => s.toggleSave(a.id, { silent: true }));
    s.toast('Moved ' + n + (n === 1 ? ' item' : ' items') + ' to your cart', { variant: 'success', actionLabel: 'View cart', onAction: () => s.openCart() });
    s.openCart();
  }

  return (
    <div className="page saved">
      <header className="saved-head">
        <div className="saved-head__copy">
          <h1 className="saved-title">Saved{items.length > 0 && <span className="saved-title__n mds-num" aria-label={items.length + (items.length === 1 ? ' item' : ' items')}>{items.length}</span>}</h1>
          <p className="saved-sub">{items.length ? 'Your board of things worth coming back to. ' + (movable.length ? 'Together they’re ' + money(worth) + ' with Personal licenses.' : 'You already own everything on it.') : 'Your board of things worth coming back to.'}</p>
        </div>
        {items.length > 0 && (
          <div className="saved-head__acts">
            <Button variant="secondary" leadingIcon="store-01" onClick={() => go('shop')}>Keep browsing</Button>
            <Button leadingIcon="shopping-bag-01" disabled={!movable.length} onClick={moveAll}>Move all to cart</Button>
          </div>
        )}
      </header>

      {items.length === 0 ? <EmptyBoard picks={popular} /> : (
        <ul className="saved-grid">{items.map((a, i) => <SavedItem key={a.id} a={a} i={i} />)}</ul>
      )}

      <Section title={items.length ? 'More like your board' : 'Popular right now'} sub={items.length ? 'Picked from what people with similar boards bought.' : 'A few things designers are saving this week.'}>
        <AssetGrid items={popular} min={240} />
      </Section>
    </div>
  );
}
Saved.title = 'Saved';
export default Saved;
