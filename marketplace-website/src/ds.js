// Marketplace Design System components (window.MarketplaceDS, loaded from bundle.js).
export const { Icon, Button, IconButton, Badge, Chip, TextField, Checkbox, Switch, PriceTag, Alert, Tabs, AssetCard, Divider, Spinner, Link, ButtonGroup, Select, SearchField, Textarea, Radio, LicenseSelector, FileUpload, FileRow, ProgressBar, Slider, OtpInput, Calendar, DatePicker, Rating, ListItem, Table, StatTile, Skeleton, AssetCardSkeleton, Toast, Tooltip, Illustration, EmptyState, Pagination, Breadcrumbs, Logo, TopNav, BottomNav, SidebarNav, Stepper, DropdownMenu, Modal, Drawer, Popover, CommandPalette, Carousel } = window.MarketplaceDS;
export const { useState, useEffect, useRef, useMemo, useCallback, useContext, createContext } = React;

/* People photos (Unsplash, see src/people/CREDITS.md). Avatars for our demo people get a real portrait;
   companies and anyone else keep initials on a pop color. */
const DS = window.MarketplaceDS, h = React.createElement;
const PHOTOS = { MO: 'mira', KA: 'kemi', LP: 'leo', AL: 'ana', TR: 'tomas', PN: 'priya', JW: 'jonah', YT: 'yuki', SR: 'me', DM: 'dana' };
export const photoFor = initials => (PHOTOS[initials] ? 'people/' + PHOTOS[initials] + '.jpg' : undefined);
const withPhoto = o => (o && !o.src && photoFor(o.initials) ? { ...o, src: photoFor(o.initials) } : o);
export function Avatar(p) { return h(DS.Avatar, withPhoto(p)); }
export function AvatarGroup(p) { return h(DS.AvatarGroup, { ...p, people: (p.people || []).map(withPhoto) }); }
export function CreatorCard(p) { return h(DS.CreatorCard, withPhoto(p)); }
export function NotificationCenter(p) { return h(DS.NotificationCenter, { ...p, items: (p.items || []).map(withPhoto) }); }
