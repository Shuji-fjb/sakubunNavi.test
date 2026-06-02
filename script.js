/**
 * 作文ナビ PC版ワイヤーフレーム 画面遷移制御スクリプト
 */
document.addEventListener("DOMContentLoaded", () => {
      // ★ 追加：kiyaku.htmlから戻ってきた場合の画面復元
  const hash = location.hash.replace('#', '');
  const validScreenIds = [
    "screen-login", "screen-home", "screen-topic", "screen-essay",
    "screen-vocab", "screen-vocab-result", "screen-vocab-correct",
    "screen-business", "screen-business-result", "screen-business-correct",
    "screen-records", "screen-mypage"
  ];

  const initialScreen = validScreenIds.includes(hash) ? hash : "screen-login";
  if (hash && validScreenIds.includes(hash)) {
    sessionStorage.removeItem('returnScreenId'); // 使い終わったらクリア
  }

  // 1. 全ての画面（.screen-wrap）を取得し、順番通りにIDを付与
  const screens = document.querySelectorAll('.screen-wrap');
  const screenIds = [
    "screen-login",           // ① ログイン
    "screen-home",            // ② ホーム
    "screen-topic",           // ③ お題選択
    "screen-essay",           // ④ AI作文添削
    "screen-vocab",           // ⑤ 語彙クイズ
    "screen-vocab-incorrect",    // ⑤-2 語彙クイズ(解答結果・不正解)
    "screen-vocab-correct",   // ⑤-3 語彙クイズ(解答結果・正解)
    "screen-vocab-result",    // ⑤-4 語彙クイズ(結果)
    "screen-business",        // ⑥ ビジネスクイズ
    "screen-business-incorrect", // ⑥-2 ビジネスクイズ(解答結果・不正解)
    "screen-business-correct",// ⑥-3 ビジネスクイズ(解答結果・正解)
    "screen-business-result", // ⑥-4 ビジネスクイズ(結果)
    "screen-records",         // ⑦ 学習記録
    "screen-mypage",          // ⑧ マイページ
    "screen-profile-edit"     // 画面保存ID
  ];
  
  screens.forEach((screen, index) => {
    if (screenIds[index]) {
      screen.id = screenIds[index];
    }
  });

  // 2. 初期状態として、ログイン画面を表示
  changeScreen(initialScreen);

  // 3. 各画面内のボタンやリンクに、動的にクリックイベントをバインド
  screens.forEach((screen) => {
    const currentId = screen.id;

    // --- A. サイドバーメニューの遷移設定 ---
    const navItems = screen.querySelectorAll('.sidebar-nav .nav-item');
    navItems.forEach(item => {
      item.style.cursor = 'pointer';
      const text = item.textContent.trim();
      
      item.addEventListener('click', () => {
        if (text.includes('ホーム')) changeScreen('screen-home');
        else if (text.includes('AI作文添削')) changeScreen('screen-topic');
        else if (text.includes('語彙クイズ')) changeScreen('screen-vocab');
        else if (text.includes('ビジネスクイズ')) changeScreen('screen-business');
        else if (text.includes('学習記録')) changeScreen('screen-records');
        else if (text.includes('マイページ')) changeScreen('screen-mypage');
      });
    });

    // --- B. 各画面固有のボタン遷移設定 ---
    
    // ① ログイン画面のログインボタン
    if (currentId === 'screen-login') {
      const loginBtn = screen.querySelector('.btn');
      if (loginBtn) {
        loginBtn.addEventListener('click', () => changeScreen('screen-home'));
      }
    }
    
    // ② ホーム画面のボタン・カード
    if (currentId === 'screen-home') {
      // 「今すぐ書く →」ボタン
      const heroBtn = screen.querySelector('.hero-card-btn');
      if (heroBtn) {
        heroBtn.addEventListener('click', () => changeScreen('screen-topic'));
      }
      // 4つの機能カード
      const featureCards = screen.querySelectorAll('.feature-card');
      featureCards.forEach(card => {
        const name = card.querySelector('.feature-name')?.textContent || '';
        card.addEventListener('click', () => {
          if (name.includes('AI作文添削')) changeScreen('screen-topic');
          else if (name.includes('語彙クイズ')) changeScreen('screen-vocab');
          else if (name.includes('ビジネスクイズ')) changeScreen('screen-business');
          else if (name.includes('学習記録')) changeScreen('screen-records');
        });
      });
    }
    
    // ③ お題選択画面
    if (currentId === 'screen-topic') {
      // 「この内容で次へ →」ボタン
      const nextBtn = screen.querySelector('.topic-option-card.free .btn');
      if (nextBtn) {
        nextBtn.addEventListener('click', () => changeScreen('screen-essay'));
      }
      // カテゴリ一覧（自己PR、ガクチカなど）
      const catItems = screen.querySelectorAll('.category-item');
      catItems.forEach(item => {
        item.addEventListener('click', () => changeScreen('screen-essay'));
      });
    }
    
    // ④ AI作文添削画面
    if (currentId === 'screen-essay') {
      // 「戻る」ボタン
      const backBtn = screen.querySelector('.btn-outline');
      if (backBtn) {
        backBtn.addEventListener('click', () => changeScreen('screen-topic'));
      }
      // 「添削する」ボタン
      const submitBtn = screen.querySelector('.card .btn:not(.btn-outline)');
      if (submitBtn) {
        submitBtn.addEventListener('click', (e) => {
          e.preventDefault();
          alert('AIによる添削処理を実行中...');
        });
      }
    }
    
    // ⑤ 語彙クイズ
    if (currentId === 'screen-vocab') {
      const quizOptions = screen.querySelectorAll('.quiz-option');
      quizOptions.forEach(opt => {
        opt.style.cursor = 'pointer';
        opt.addEventListener('click', () => {
          if (opt.textContent.includes('他人の心を推し量ること')) {
            changeScreen('screen-vocab-correct');
          } else {
            changeScreen('screen-vocab-incorrect');
          }
        });
      });
    }

    if (currentId === 'screen-vocab-correct' || currentId === 'screen-vocab-incorrect') {
      const nextBtn = screen.querySelector('.btn');
      nextBtn.addEventListener('click',() => {
        changeScreen('screen-vocab-result');
      });
    }

    // ⑥ ビジネスクイズ
    if (currentId === 'screen-business') {
      const quizOptions = screen.querySelectorAll('.quiz-option');
      quizOptions.forEach(opt => {
        opt.style.cursor = 'pointer';
        opt.addEventListener('click', () => {
          if (opt.textContent.includes('確認いたしました')) {
            changeScreen('screen-business-correct');
          } else {
            changeScreen('screen-business-incorrect');
          }
        });
      });
    }

    // 解答結果画面の「次の問題へ」ボタン処理
    if (currentId === 'screen-business-incorrect' || currentId === 'screen-business-correct') {
      const nextBtn = screen.querySelector('.btn');
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          changeScreen('screen-business-result');
        });
      }
    }
    
    // ⑧ マイページ画面のログアウト
    if (currentId === 'screen-mypage') {
      const menuListItems = screen.querySelectorAll('.menu-list li');
      menuListItems.forEach(item => {
        if (item.textContent.includes('ログアウト')) {
          item.style.cursor = 'pointer';
          item.addEventListener('click', () => changeScreen('screen-login'));
        }
      });
       // ★ 追加：利用規約リンクをクリックしたら現在の画面IDを保存
      const kiyakuLinks = screen.querySelectorAll('a[href*="利用規約"]');
      kiyakuLinks.forEach(link => {
        link.addEventListener('click', () => {
      sessionStorage.setItem('returnScreenId', currentId);
         });
      });
    }
  });
});
/**
 * 画面を切り替えるグローバル関数
 * @param {string} targetId - 表示したい画面のID
 */
function changeScreen(targetId) {
  const screens = document.querySelectorAll('.screen-wrap');
  let targetExists = false;

  screens.forEach(screen => {
    if (screen.id === targetId) {
      screen.classList.add('active');
      targetExists = true;
    } else {
      screen.classList.remove('active');
    }
  });

  if (!targetExists) {
    console.warn("指定された画面IDが見つかりません: " + targetId);
    return;
  }

  // トップの見出し・説明文の表示制御（ログイン画面以外では隠す）
  const header1 = document.getElementById('dev-header');
  const header2 = document.getElementById('dev-subheader');
  const legend = document.getElementById('dev-legend');
  
  if (header1 && header2 && legend) {
    if (targetId === 'screen-login') {
      header1.style.display = 'block';
      header2.style.display = 'block';
      legend.style.display = 'block';
    } else {
      header1.style.display = 'none';
      header2.style.display = 'none';
      legend.style.display = 'none';
    }
  }

  // 各画面のサイドバーの「active」ハイライト状態を更新
  screens.forEach(screen => {
    const navItems = screen.querySelectorAll('.sidebar-nav .nav-item');
    navItems.forEach(item => {
      item.classList.remove('active');
      const text = item.textContent.trim();
      
      if (targetId === 'screen-home' && text.includes('ホーム')) item.classList.add('active');
      else if ((targetId === 'screen-topic' || targetId === 'screen-essay') && text.includes('AI作文添削')) item.classList.add('active');
      else if (targetId.startsWith('screen-vocab') && text.includes('語彙クイズ')) item.classList.add('active');
      else if (targetId.startsWith('screen-business') && text.includes('ビジネスクイズ')) item.classList.add('active');
      else if (targetId === 'screen-records' && text.includes('学習記録')) item.classList.add('active');
      else if (targetId === 'screen-mypage' && text.includes('マイページ')) item.classList.add('active');
    });
  });

  // 画面最上部にスクロール
  window.scrollTo({ top: 0, behavior: 'instant' });
}
