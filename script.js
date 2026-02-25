   function toggleMenu() {
      const menu = document.getElementById('navbar-menu');
      const ham = document.querySelector('.ham');
      menu.classList.toggle('show');
      ham.style.transform = menu.classList.contains('show') ? 'rotate(90deg)' : 'rotate(0deg)';
    }
    window.onclick = function(event) {
      if (!event.target.matches('.ham')) {
        const menu = document.getElementById('navbar-menu');
        const ham = document.querySelector('.ham');
        if (menu.classList.contains('show')) {
          menu.classList.remove('show');
          ham.style.transform = 'rotate(0deg)';
        }
      }
    }