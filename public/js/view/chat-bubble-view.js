export function updateOwnBubble(text) {
  const bubble = document.querySelector('.ownBubble');
  if (!bubble) return;

  if (typeof text === 'string' && text.replace(/\s/g, '') !== '') {
    bubble.innerHTML = text.replace(/\n/g, '<br>');
    bubble.style.display = 'block';
  } else {
    bubble.style.display = 'none';
  }
}

export function updateOtherBubble(text) {
  const bubble = document.querySelector('.otherBubble');
  if (!bubble) return;

  if (typeof text === 'string' && text.replace(/\s/g, '') !== '') {
    bubble.innerHTML = text.replace(/\n/g, '<br>');
    bubble.style.display = 'block';
  } else {
    bubble.style.display = 'none';
  }
}