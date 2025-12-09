// Carrossel de depoimentos
document.addEventListener("DOMContentLoaded", function () {
  // 1. DADOS DAS AVALIAÇÕES
  const reviews = [
    {
      name: "Larissa Almeida",
      text: "Instalação muito boa, excelente profissional, qualidade na entrega e explicações acessíveis. Eu recomendo demais!",
    },
    {
      name: "Ingrid Mondego",
      text: "Posso afirmar com toda certeza que é o melhor profissional no ramo de climatização, dentro do Rio de Janeiro. Super Honesto, atencioso e tem um preço justo.",
    },
    {
      name: "Claudia Scott",
      text: "Pedro é atencioso, ágil, explica tudo e deixa o ar um brinco de tão limpo! Já é a segunda vez que trabalho com ele e não troco mais!",
    },
    {
      name: "Angela Carreiras",
      text: "Atendimento excelente. Bom profissional e preço justo pelos serviços prestados. Profissional qualificado a tirar suas dúvidas e resolver os problemas.",
    },
    {
      name: "Marden Dias",
      text: "Excelente profissional. Tudo muito bem explicado e meu ar ficou excelente! Tá gelando mais que a Frozen!",
    },
    {
      name: "Marcelo Afonso",
      text: "Profissional que segue a norma, o manual, é credenciado e é detalhista. Recomendo.",
    },
    {
      name: "Luciano dos Santos",
      text: "Se quer uma boa indicação nesse ramo... é essa aqui! Nunca tive dores de cabeça nas vzs que precisei acionar a PDJ! Muito satisfeito msm!",
    },
  ];

  // 2. SELETORES DOS ELEMENTOS
  const track = document.querySelector(".carousel-track");
  const carousel = document.querySelector(".testimonial-carousel");
  const nextBtn = document.querySelector(".carousel-btn.next");
  const prevBtn = document.querySelector(".carousel-btn.prev");

  if (!track || !carousel || !nextBtn || !prevBtn) return;

  let autoplayTimer;
  let isTransitioning = false;

  // 3. POPULAR O CARROSSEL E CLONAR
  reviews.forEach((review, index) => {
    const card = document.createElement("div");
    card.classList.add("testimonial-card");

    card.innerHTML = `
      <div class="stars">
        &#9733;&#9733;&#9733;&#9733;&#9733;
      </div>
      <p class="review-text">"${review.text}"</p>
      <p class="reviewer-name">- ${review.name}</p>
    `;
    track.appendChild(card);
  });

  // --- INÍCIO DA LÓGICA DE CLONAGEM ---
  const cards = document.querySelectorAll(".testimonial-card");
  const numSlides = cards.length;

  // Clona o primeiro e o último card
  const firstClone = cards[0].cloneNode(true);
  const lastClone = cards[numSlides - 1].cloneNode(true);

  // Adiciona os clones ao trilho
  track.appendChild(firstClone); // Adiciona o clone do primeiro no final
  track.prepend(lastClone); // Adiciona o clone do último no início

  // O trilho agora é: [Clone 7] [Real 1] ... [Real 7] [Clone 1]

  const allCards = document.querySelectorAll(".testimonial-card");
  let currentIndex = 1; // Começamos no "Real 1" (índice 1)
  // --- FIM DA LÓGICA DE CLONAGEM ---

  // 4. FUNÇÃO DE POSICIONAMENTO
  function getOffset(index) {
    // Usa o primeiro *real* card para o cálculo
    const cardWidth = cards[0].offsetWidth;
    const trackStyle = getComputedStyle(track);
    const gap = parseFloat(trackStyle.gap) || 0;
    // Calcula o offset baseado no índice
    return index * (cardWidth + gap);
  }

  function showSlide(index) {
    track.style.transform = `translateX(-${getOffset(index)}px)`;
  }

  // 5. INICIALIZAÇÃO
  track.style.transition = "none"; // Desabilita transição para o setup inicial
  showSlide(currentIndex); // Posiciona no "Real 1"

  // Reabilita a transição após o setup
  setTimeout(() => {
    track.style.transition = "transform 0.5s ease-in-out";
  }, 0);

  // 6. LÓGICA DE LOOP (Ouvinte do fim da transição)
  track.addEventListener("transitionend", () => {
    if (currentIndex === numSlides + 1) {
      // Se parou no "Clone 1" (final)
      track.style.transition = "none"; // Desliga a transição
      currentIndex = 1; // Pula para o "Real 1" (início)
      showSlide(currentIndex);
      setTimeout(() => {
        // Liga a transição de volta
        track.style.transition = "transform 0.5s ease-in-out";
      }, 0);
    }

    if (currentIndex === 0) {
      // Se parou no "Clone 7" (início)
      track.style.transition = "none"; // Desliga a transição
      currentIndex = numSlides; // Pula para o "Real 7" (final)
      showSlide(currentIndex);
      setTimeout(() => {
        // Liga a transição de volta
        track.style.transition = "transform 0.5s ease-in-out";
      }, 0);
    }

    isTransitioning = false; // Permite o próximo movimento

    // Reinicia o timer de autoplay *depois* que a transição termina,
    // mas apenas se o mouse não estiver sobre o carrossel.
    if (!carousel.matches(":hover")) {
      startAutoplay();
    }
  });

  // 7. FUNÇÕES DE NAVEGAÇÃO
  function nextSlide() {
    if (isTransitioning) return;
    stopAutoplay(); // Cancela o timer pendente no início
    isTransitioning = true;
    currentIndex++;
    showSlide(currentIndex);
  }

  function prevSlide() {
    if (isTransitioning) return;
    stopAutoplay(); // Cancela o timer pendente no início
    isTransitioning = true;
    currentIndex--;
    showSlide(currentIndex);
  }

  // 8. FUNÇÕES DE AUTOPLAY (ROLAGEM AUTOMÁTICA)
  function startAutoplay() {
    stopAutoplay(); // Garante que não haja timers duplicados
    autoplayTimer = setTimeout(nextSlide, 4000);
  }

  function stopAutoplay() {
    clearTimeout(autoplayTimer);
  }

  // 9. EVENT LISTENERS (Ouvintes de eventos)
  nextBtn.addEventListener("click", nextSlide);
  prevBtn.addEventListener("click", prevSlide);
  carousel.addEventListener("mouseenter", stopAutoplay);
  carousel.addEventListener("mouseleave", startAutoplay);

  // 10. SUPORTE A SWIPE (Touch)
  let touchStartX = 0;
  let touchEndX = 0;
  let touchStartY = 0;
  let touchEndY = 0;

  carousel.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
      stopAutoplay();
    },
    { passive: true }
  );

  carousel.addEventListener(
    "touchend",
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleSwipe();
      startAutoplay();
    },
    { passive: true }
  );

  function handleSwipe() {
    const swipeThreshold = 50;
    const horizontalDiff = touchEndX - touchStartX;
    const verticalDiff = Math.abs(touchEndY - touchStartY);

    // Verifica se o movimento é principalmente horizontal
    if (
      Math.abs(horizontalDiff) > swipeThreshold &&
      Math.abs(horizontalDiff) > verticalDiff
    ) {
      if (horizontalDiff > 0) {
        // Swipe para direita - vai para o anterior
        prevSlide();
      } else {
        // Swipe para esquerda - vai para o próximo
        nextSlide();
      }
    }
  }

  // 11. INICIALIZAÇÃO
  startAutoplay(); // Inicia o autoplay na carga da página
});

// Carrossel de imagens da seção Motivos
document.addEventListener("DOMContentLoaded", function () {
  // Imagens para o carrossel (todas as .png da pasta imgs)
  const motivosImages = [
    "./imgs/ph05.jpg",
    "./imgs/ph06.jpg",
    "./imgs/ph04.jpg",
    "./imgs/ph07.jpg",
    "./imgs/ph02.jpg",
  ];

  const motivosTrack = document.querySelector(".motivos-carousel-track");
  const motivosCarousel = document.querySelector(".motivos-carousel");

  if (!motivosTrack || !motivosCarousel) return;

  let motivosAutoplayTimer;
  let motivosIsTransitioning = false;

  // Popular o carrossel com as imagens
  motivosImages.forEach((imgSrc, index) => {
    const img = document.createElement("img");
    img.classList.add("motivos-carousel-image");
    img.src = imgSrc;
    img.alt = `Imagem ${index + 1}`;
    motivosTrack.appendChild(img);
  });

  // Lógica de clonagem para loop infinito
  const motivosCards = document.querySelectorAll(".motivos-carousel-image");
  const motivosNumSlides = motivosCards.length;

  const motivosFirstClone = motivosCards[0].cloneNode(true);
  const motivosLastClone = motivosCards[motivosNumSlides - 1].cloneNode(true);

  motivosTrack.appendChild(motivosFirstClone);
  motivosTrack.prepend(motivosLastClone);

  const motivosAllCards = document.querySelectorAll(".motivos-carousel-image");
  let motivosCurrentIndex = 1;

  function motivosGetOffset(index) {
    const cardWidth = motivosCards[0].offsetWidth;
    return index * cardWidth;
  }

  function motivosShowSlide(index) {
    motivosTrack.style.transform = `translateX(-${motivosGetOffset(index)}px)`;
  }

  // Inicialização
  motivosTrack.style.transition = "none";
  motivosShowSlide(motivosCurrentIndex);

  setTimeout(() => {
    motivosTrack.style.transition = "transform 0.5s ease-in-out";
  }, 0);

  // Lógica de loop
  motivosTrack.addEventListener("transitionend", () => {
    if (motivosCurrentIndex === motivosNumSlides + 1) {
      motivosTrack.style.transition = "none";
      motivosCurrentIndex = 1;
      motivosShowSlide(motivosCurrentIndex);
      setTimeout(() => {
        motivosTrack.style.transition = "transform 0.5s ease-in-out";
      }, 0);
    }

    if (motivosCurrentIndex === 0) {
      motivosTrack.style.transition = "none";
      motivosCurrentIndex = motivosNumSlides;
      motivosShowSlide(motivosCurrentIndex);
      setTimeout(() => {
        motivosTrack.style.transition = "transform 0.5s ease-in-out";
      }, 0);
    }

    motivosIsTransitioning = false;

    if (!motivosCarousel.matches(":hover")) {
      motivosStartAutoplay();
    }
  });

  function motivosNextSlide() {
    if (motivosIsTransitioning) return;
    motivosStopAutoplay();
    motivosIsTransitioning = true;
    motivosCurrentIndex++;
    motivosShowSlide(motivosCurrentIndex);
  }

  function motivosPrevSlide() {
    if (motivosIsTransitioning) return;
    motivosStopAutoplay();
    motivosIsTransitioning = true;
    motivosCurrentIndex--;
    motivosShowSlide(motivosCurrentIndex);
  }

  function motivosStartAutoplay() {
    motivosStopAutoplay();
    motivosAutoplayTimer = setTimeout(motivosNextSlide, 4000);
  }

  function motivosStopAutoplay() {
    clearTimeout(motivosAutoplayTimer);
  }

  motivosCarousel.addEventListener("mouseenter", motivosStopAutoplay);
  motivosCarousel.addEventListener("mouseleave", motivosStartAutoplay);

  // Suporte a swipe
  let motivosTouchStartX = 0;
  let motivosTouchEndX = 0;
  let motivosTouchStartY = 0;
  let motivosTouchEndY = 0;

  motivosCarousel.addEventListener(
    "touchstart",
    (e) => {
      motivosTouchStartX = e.changedTouches[0].screenX;
      motivosTouchStartY = e.changedTouches[0].screenY;
      motivosStopAutoplay();
    },
    { passive: true }
  );

  motivosCarousel.addEventListener(
    "touchend",
    (e) => {
      motivosTouchEndX = e.changedTouches[0].screenX;
      motivosTouchEndY = e.changedTouches[0].screenY;
      motivosHandleSwipe();
      motivosStartAutoplay();
    },
    { passive: true }
  );

  function motivosHandleSwipe() {
    const swipeThreshold = 50;
    const horizontalDiff = motivosTouchEndX - motivosTouchStartX;
    const verticalDiff = Math.abs(motivosTouchEndY - motivosTouchStartY);

    if (
      Math.abs(horizontalDiff) > swipeThreshold &&
      Math.abs(horizontalDiff) > verticalDiff
    ) {
      if (horizontalDiff > 0) {
        motivosPrevSlide();
      } else {
        motivosNextSlide();
      }
    }
  }

  motivosStartAutoplay();
});

// Carrossel de marcas infinito
document.addEventListener("DOMContentLoaded", function () {
  const brandsLogos = [
    "imgs/marcas/01daikin.png",
    "imgs/marcas/02fujitsu.svg",
    "imgs/marcas/03hitachi.png",
    "imgs/marcas/04samsung.png",
    "imgs/marcas/05lg.svg",
    "imgs/marcas/06gree.svg",
    "imgs/marcas/07midea.png",
    "imgs/marcas/08carrier.svg",
    "imgs/marcas/09trane.png",
    "imgs/marcas/10tcl.svg",
    "imgs/marcas/11eletrolux.png",
    "imgs/marcas/12philco.png",
    "imgs/marcas/13consul.png",
  ];

  const brandsTrack = document.querySelector(".brands-carousel-track");

  if (!brandsTrack) return;

  // Adiciona as logos duas vezes para criar o efeito de loop infinito
  const addLogos = () => {
    brandsLogos.forEach((logoSrc) => {
      const img = document.createElement("img");
      img.classList.add("brand-logo");
      img.src = logoSrc;
      img.alt = "Logo de marca";
      // Evita arrastar a imagem (melhora comportamento mobile)
      img.draggable = false;
      brandsTrack.appendChild(img);
    });
  };

  // Adiciona as logos duas vezes para o loop contínuo
  addLogos();
  addLogos();
});

// Smooth scroll para links internos (caso precise adicionar navegação)
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});
