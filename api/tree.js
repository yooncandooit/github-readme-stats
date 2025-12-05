export default function handler(req, res) {
  // 트리를 구성할 점(Light)의 개수
  const count = 50; 
  let treeHtml = '';

  // 1. 반복문으로 트리의 나선형 점들을 생성합니다.
  for (let i = 0; i < count; i++) {
    // 위로 갈수록 좁아지고(rotate), 높이(y)는 올라가는 계산
    const y = (i / count) * 100; 
    const rotate = i * 20; // 나선형 회전 각도
    
    // 알록달록한 색상 (CSS 변수로 주입)
    // 짝수/홀수 번갈아가며 색상 변경 (파랑/보라 계열)
    const color = i % 2 === 0 ? '#00f2ff' : '#bd00ff'; 

    treeHtml += `
      <div class="tree_light" style="--y: ${y}; --rotate: ${rotate}; --color: ${color};"></div>
    `;
  }

  // 2. SVG로 감싸서 반환 (HTML + CSS 포함)
  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "s-maxage=1, stale-while-revalidate");

  res.status(200).send(`
    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml">
          <style>
            .container {
              display: flex;
              align-items: center;
              justify-content: center;
              height: 400px;
              background: #0d1117; /* 깃허브 다크모드 배경색과 일치 */
              overflow: hidden;
            }

            .tree {
              position: relative;
              width: 20px;
              height: 300px;
              transform-style: preserve-3d;
              animation: spin 5s infinite linear;
            }

            /* 빛나는 점 (나뭇잎) 스타일 */
            .tree_light {
              position: absolute;
              left: 50%;
              bottom: calc(var(--y) * 1% + 10%); /* 위치 계산 */
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: var(--color);
              
              /* 3D 변환: 회전 후 바깥으로 밀어내기 */
              transform: 
                rotateY(calc(var(--rotate) * 1deg)) 
                translateZ(60px); 
              
              /* 네온사인 효과 */
              box-shadow: 0 0 10px var(--color), 0 0 20px var(--color);
            }

            /* 전체 회전 애니메이션 */
            @keyframes spin {
              0% { transform: rotateX(-20deg) rotateY(0deg); }
              100% { transform: rotateX(-20deg) rotateY(360deg); }
            }
          </style>

          <div class="container">
            <div class="tree">
              ${treeHtml} </div>
          </div>
        </div>
      </foreignObject>
    </svg>
  `);
}
