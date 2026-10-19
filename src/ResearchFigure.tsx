import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Maximize2, Minus, Plus, X } from 'lucide-react';
import { figureUrl, type ResearchFigure as FigureData } from './figures';

export default function ResearchFigure({ figure, priority = false, className = '' }: {
  figure: FigureData; priority?: boolean; className?: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [open]);
  function show() {
    setZoomed(false);
    dialog.current?.showModal();
    closeButton.current?.focus();
    setOpen(true);
  }
  return <figure className={`research-figure ${className}`}>
    <button className="figure-trigger" onClick={show} aria-label={`Enlarge ${figure.title}`}>
      <img src={figureUrl(figure)} alt={figure.alt} width={figure.width} height={figure.height}
        loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} decoding="async" />
      <span className="figure-enlarge"><Maximize2 size={14} /> Enlarge figure</span>
    </button>
    <figcaption><span className="figure-source">FROM THE POSTER</span><p>{figure.caption}</p></figcaption>
    <dialog ref={dialog} className="figure-dialog" aria-labelledby={`${figure.id}-dialog-title`}
      onClose={() => setOpen(false)} onClick={event => { if (event.target === dialog.current) dialog.current.close(); }}>
      <div className="figure-dialog-panel">
        <div className="figure-dialog-heading"><h2 id={`${figure.id}-dialog-title`}>{figure.title}</h2>
          <div><button className="text-button" onClick={() => setZoomed(!zoomed)} aria-pressed={zoomed}>
            {zoomed ? <Minus size={16} /> : <Plus size={16} />}{zoomed ? 'Fit to view' : 'Original size'}
          </button><button ref={closeButton} className="icon-button" aria-label="Close figure" onClick={() => dialog.current?.close()}><X size={22} /></button></div>
        </div>
        <div className={`figure-dialog-canvas ${zoomed ? 'is-zoomed' : ''}`} tabIndex={0} aria-label="Figure viewer; scroll to explore at original size">
          {open && <img src={figureUrl(figure)} alt={figure.alt} width={figure.width} height={figure.height}
            style={zoomed ? { width: figure.width } : undefined} />}
        </div>
        <div className="figure-dialog-caption"><p>{figure.caption}</p><a href={figureUrl(figure)} target="_blank" rel="noreferrer">Open original image <ArrowUpRight size={14} /></a></div>
      </div>
    </dialog>
  </figure>;
}
