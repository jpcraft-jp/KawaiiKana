import React, { useEffect, useState, useRef } from 'react';

interface KanjiAnimatorProps {
  char: string; // Das Zeichen, z.B. "ア"
  size?: number;
  speed?: number; // Sekunden pro Strich
}

const KanjiAnimator: React.FC<KanjiAnimatorProps> = ({ char, size = 256, speed = 0.6 }) => {
  const [paths, setPaths] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchKanjiData = async () => {
      setLoading(true);
      try {
        // Unicode in Hex umwandeln (z.B. ア -> 030a2)
        const codePoint = char.charCodeAt(0)!.toString(16).padStart(5, '0');
        const url = `https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/${codePoint}.svg`;

        const response = await fetch(url);
        const svgText = await response.text();

        // Parser, um die 'd' Attribute der Pfade zu extrahieren
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgText, "image/svg+xml");
        const pathElements = Array.from(doc.querySelectorAll('path'));
        
        // Wir filtern nur die eigentlichen Zeichen-Pfade (KanjiVG nutzt Gruppen)
        const dAttributes = pathElements
          .map(p => p.getAttribute('d'))
          .filter((d): d is string => !!d);

        setPaths(dAttributes);
      } catch (err) {
        console.error("Fehler beim Laden von KanjiVG:", err);
      } finally {
        setLoading(false);
      }
    };

    if (char) fetchKanjiData();
  }, [char]);

  if (loading) return <div>Lade Animation...</div>;

  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      <svg
        viewBox="0 0 109 109"
        style={{ width: '100%', height: '100%', transform: 'scale(1)' }}
      >
        {paths.map((d, index) => (
          <Stroke key={`${char}-${index}`} d={d} index={index} speed={speed} />
        ))}
      </svg>
      
      {/* CSS für die Animation */}
      <style>{`
        @keyframes drawStroke {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
};

const Stroke: React.FC<{ d: string; index: number; speed: number }> = ({ d, index, speed }) => {
  const pathRef = useRef<SVGPathElement>(null);
  const [length, setLength] = useState(0);

  useEffect(() => {
    if (pathRef.current) {
      // Misst die exakte Länge des Pfades für die Animation
      setLength(pathRef.current.getTotalLength());
    }
  }, [d]);

  return (
    <path
      ref={pathRef}
      d={d}
      fill="none"
      stroke="#2D3436" // Dunkelgrau wie Tinte
      strokeWidth="3"
      strokeLinecap="round"
      style={{
        strokeDasharray: length,
        strokeDashoffset: length,
        animation: `drawStroke ${speed}s ease-in-out forwards`,
        animationDelay: `${index * (speed * 0.8)}s`, // Kleiner Overlap für natürlicheren Fluss
      }}
    />
  );
};

export default KanjiAnimator;