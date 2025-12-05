export default function handler(req, res) {
  const count = 80; // 트리의 점 개수
  const snowCount = 40; // 눈송이 개수
  let treeHtml = '';
  let snowHtml = '';

  // 1. 트리 점 생성 (사진 속 형광 컬러 적용)
  for (let i = 0; i < count; i++) {
    const y = (i / count) * 100;
    const rotate = i * 30;
    const radius = 80 * (1 - y / 100);

    let color, glow;

    if (i % 2 === 0) {
      // 짝수: 사진 속 밝은 핑크빛 레드
      color = '#FF4081'; 
      glow = '#FF80AB';  
    } else {
      // 홀수: 사진 속 밝은 형광 민트/그린
      color = '#00E676'; 
      glow = '#69F0AE'; 
    }

    treeHtml += `
      <div class="tree_light" style="--y: ${y}; --rotate: ${rotate}; --radius: ${radius}; --color: ${color}; --glow: ${glow};"></div>
    `;
  }

  // 2. 눈송이 생성 (랜덤 위치 및 속도)
  for (let j = 0; j < snowCount; j++) {
    const left = Math.random() * 100; // 가로 위치 (0~100%)
    const delay = Math.random() * 5;  // 떨어지기 시작하는 시간차
    const duration = 5 + Math.random() * 5; // 떨어지는 속도 (5~10초)
    const opacity = 0.4 + Math.random() * 0.6; // 투명도 랜덤

    snowHtml += `
      <div class="snow" style="--left: ${left}%; --delay: ${delay}s; --duration: ${duration}s; --opacity: ${opacity};"></div>
    `;
  }

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
          position: relative;
        }

        /* 3D 트리 스타일 */
        .tree {
          position: relative;
          width: 0;
          height: 300px;
          transform-style: preserve-3d;
          animation: spin 12s infinite linear;
          transform-origin: center bottom;
          z-index: 2; /* 눈보다 앞에 오도록 설정 */
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
          /* 빛 퍼짐 효과 강화 */
          box-shadow: 0 0 8px var(--glow), 0 0 20px var(--glow);
        }

        /* 별 스타일 */
        .star {
          position: absolute;
          left: 50%;
          bottom: 82%; 
          transform: translate(-50%, 0);
          font-size: 28px;
          text-shadow: 0 0 10px #ffd700, 0 0 20px #ffae00;
          z-index: 10;
        }

        @keyframes spin {
          0% { transform: rotateX(-10deg) rotateY(0deg); }
          100% { transform: rotateX(-10deg) rotateY(360deg); }
        }

        /* ❄️ 눈 내리는 효과 스타일 */
        .snow {
          position: absolute;
          top: -10px;
          left: var(--left);
          width: 3px;
          height: 3px;
          background: white;
          border-radius: 50%;
          opacity: var(--opacity);
          animation: fall var(--duration) linear infinite;
          animation-delay: var(--delay);
          z-index: 1; /* 트리 뒤에 눈이 오도록 (원하면 3으로 변경) */
          box-shadow: 0 0 5px white; /* 눈도 살짝 빛나게 */
        }

        @keyframes fall {
          0% { transform: translateY(-10px); }
          100% { transform: translateY(420px); }
        }
      </style>

      <div class="container">
        ${snowHtml}
        
        <div class="tree">
          ${treeHtml}
        </div>

        <div class="star">⭐</div>
      </div>
    </div>
  </foreignObject>
</svg>`);
}
