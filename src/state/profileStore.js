import { create } from 'zustand';

export const useProfileStore = create((set, get) => {
  const loadTiles = () => {
    const stored = JSON.parse(localStorage.getItem('tiles')) || [];
    return stored.map(tile => ({
      x: 0,
      y: Infinity,
      w: 1,
      h: 1,
      i: tile.id,
      ...tile,
    }));
  };

  return {
    tiles: loadTiles(),

    editorOpen: false,
    editingTileId: null,

    setEditorOpen: (isOpen, tileId = null) => {
      set({ editorOpen: isOpen, editingTileId: tileId });
    },

    setTiles: (tiles) => {
      set({ tiles });
      localStorage.setItem('tiles', JSON.stringify(tiles));
    },

    addTile: (tile) => {
      const id = crypto.randomUUID();
      const newTile = {
        id,
        i: id,
        type: 'text',
        bgColor: '#1e1e1e',
        font: 'sans-serif',
        x: 0,
        y: Infinity, // auto-place at bottom
        w: 1,
        h: 1,
        ...tile,
      };
      const updated = [...get().tiles, newTile];
      set({ tiles: updated });
      localStorage.setItem('tiles', JSON.stringify(updated));
    },

    updateLayout: (layout) => {
      const tiles = get().tiles.map((tile) => {
        const l = layout.find((item) => item.i === tile.id);
        return l ? { ...tile, x: l.x, y: l.y, w: l.w, h: l.h } : tile;
      });
      set({ tiles });
      localStorage.setItem('tiles', JSON.stringify(tiles));
    },

    removeTile: (id) => {
      const updated = get().tiles.filter((tile) => tile.id !== id);
      set({ tiles: updated });
      localStorage.setItem('tiles', JSON.stringify(updated));
    },

    resetTiles: () => {
      set({ tiles: [] });
      localStorage.removeItem('tiles');
    }
  };
});
