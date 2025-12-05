export default function handler(req, res) {
  const count = 80;
  let treeHtml = '';

  for (let i = 0; i < count; i++) {
    const y = (i / count) * 100;
    const rotate = i * 30;
    const radius = 80 * (1 - y / 100);

    const color = i % 2 === 0 ? '#F44336' : '#336130';

    treeHtml += `
      <div class="tree_light" style="--y: ${y}; --rotate: ${rotate}; --radius: ${radius}; --color: ${color};"></div>
    `;
  }

  treeHtml += `
    <div class="star">⭐</div>
  `;

  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "s-maxage=1, stale-while-revalidate");

  res.status(200).send(`<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
  <foreignObject width="100%" height="100%">
    <div xmlns="http://www.w3.org/1999/xhtml">
      <style>
        .container {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 400px;
          overflow: hidden;
          perspective: 800px;
        }

        .tree {
          position: relative;
          width: 0;
          height: 300px;
          transform-style: preserve-3d;
          animation: spin 12s infinite linear;
          transform-origin: center bottom;
        }

        .tree_light {
          position: absolute;
          left: 50%;
          bottom: calc(var(--y) * 0.8% + 10%);
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--color);
          transform: rotateY(calc(var(--rotate) * 1deg)) translateZ(calc(var(--radius) * 1px));
          box-shadow: 0 0 8px var(--color), 0 0 20px var(--color);
        }

        .star {
          position: absolute;
          left: 50%;
          bottom: 90%;
          transform: translate(-50%, 0);
          font-size: 28px;
          text-shadow: 0 0 10px #ffd700, 0 0 20px #ffae00;
        }

        @keyframes spin {
          0% { transform: rotateX(-10deg) rotateY(0deg); }
          100% { transform: rotateX(-10deg) rotateY(360deg); }
        }
      </style>
      <div class="container">
        <div class="tree">
          ${treeHtml}
        </div>
      </div>
    </div>
  </foreignObject>
</svg>`);
}
