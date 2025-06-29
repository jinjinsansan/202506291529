import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// パフォーマンス測定
console.time('app-render');

// アプリのレンダリング
const renderApp = () => {
  const root = createRoot(document.getElementById('root')!);
  root.render(<App />);
  console.timeEnd('app-render');
  
  // ローディング画面を非表示
  setTimeout(() => {
    const loader = document.getElementById('app-loading');
    if (loader) {
      loader.classList.add('fade-out');
      setTimeout(() => {
        if (loader.parentNode) {
          loader.parentNode.removeChild(loader);
        }
      }, 500);
    }
  }, 300);
};

// DOMContentLoadedイベントでレンダリングを開始
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  renderApp();
}