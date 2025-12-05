export default function handler(req, res) {
  // 트리를 구성할 점(Light)의 개수 (늘리면 더 촘촘해집니다)
  const count = 80;
  let treeHtml = '';

  for (let i = 0; i < count; i++) {
    // 1. 높이(y) 계산: 0% (바닥) ~ 100% (꼭대기)
    const y = (i / count) * 100;
    
    // 2. 회전 각도(rotate) 계산: 점 하나당 30도씩 회전 (나선형 유지)
    const rotate = i * 30;
    
    // 3. ⭐ 핵심! 원뿔 모양 만들기 (반지름 계산) ⭐
    // 바닥(y=0)일 때 가장 넓고(radius=80px), 꼭대기(y=100)로 갈수록 0에 가까워짐
    const radius = 80 * (1 - y / 100);

    // 색상: 파랑(#00f2ff)과 보라(#bd00ff) 교차
    const color = i % 2 === 0 ? '#00f2ff' : '#bd00ff';

    // HTML 생성: 계산된 radius를 CSS 변수(--radius)로 전달
    treeHtml += `
      <div class="tree_light" style="--y: ${y}; --rotate: ${rotate}; --radius: ${radius}; --color: ${color};"></div>
    `;
  }

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
              /* background: #0d1117; <-- ⭐ 배경색 삭제 (투명 적용) */
              overflow: hidden;
              perspective: 800px; /* 3D 원근감 추가 */
            }

            .tree {
              position: relative;
              width: 0;   /* 너비를 0으로 해서 중심축 기준 회전 */
              height: 300px;
              transform-style: preserve-3d;
              animation: spin 5s infinite linear;
              transform-origin: center bottom; /* 회전 중심을 바닥으로 설정 */
            }

            /* 빛나는 점 (나뭇잎) 스타일 */
            .tree_light {
              position: absolute;
              left: 50%;
              /* 높이 설정: 아래쪽 여백을 줘서 바닥에서 시작하도록 조정 */
              bottom: calc(var(--y) * 0.8% + 10%); 
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: var(--color);
              
              /* !!! 3D 배치 !!! */
              /* 1. 중심축에서 계산된 반지름(radius)만큼 밖으로 밀어냄 (translateZ) */
              /* 2. 지정된 각도(rotate)만큼 회전시켜 나선형 배치 */
              transform: 
                rotateY(calc(var(--rotate) * 1deg)) 
                translateZ(calc(var(--radius) * 1px)); 
              
              box-shadow: 0 0 5px var(--color), 0 0 15px var(--color); /* 네온 효과 살짝 줄임 */
            }

            @keyframes spin {
              /* 살짝 위에서 내려다보는 각도(-10deg)로 회전 */
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
    </svg>
  `);
}
