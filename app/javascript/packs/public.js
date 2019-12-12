import loadPolyfills from '../mastodon/load_polyfills';
import ready from '../mastodon/ready';

window.addEventListener('message', e => {
  const data = e.data || {};

  if (!window.parent || data.type !== 'setHeight') {
    return;
  }

  ready(() => {
    window.parent.postMessage({
      type: 'setHeight',
      id: data.id,
      height: document.getElementsByTagName('html')[0].scrollHeight,
    }, '*');
  });
});

function main() {
  const { length } = require('stringz');
  const IntlRelativeFormat = require('intl-relativeformat').default;
  const { delegate } = require('rails-ujs');
  const { getInstanceDomain, getInstanceColor, getContrastYIQ } = require('../mastodon/instance_color');
  const emojify = require('../mastodon/emoji').default;
  const { getLocale } = require('../mastodon/locales');
  const { localeData } = getLocale();
  const VideoContainer = require('../mastodon/containers/video_container').default;
  const MediaGalleryContainer = require('../mastodon/containers/media_gallery_container').default;
  const CardContainer = require('../mastodon/containers/card_container').default;
  const React = require('react');
  const ReactDOM = require('react-dom');

  localeData.forEach(IntlRelativeFormat.__addLocaleData);

  ready(() => {
    const locale = document.documentElement.lang;

    const dateTimeFormat = new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });

    const relativeFormat = new IntlRelativeFormat(locale);

    [].forEach.call(document.querySelectorAll('.mention'), (content) => {
      if (content.classList.contains('hashtag'))
        return;

      let domainName = getInstanceDomain('', content.href);
      let color = getInstanceColor(domainName);

      content.setAttribute('title', `${content.textContent}@${domainName}`);
      content.setAttribute('style', `border-radius: 4px; border-left: 2px solid #${color}; border-bottom: 1px solid #${color}; padding-right: 2px;`);
      let at = content.firstChild;

      if (at.nodeValue === '@' || at.textContent === '@') {
        let newSpan = document.createElement('b');
        newSpan.textContent = '@';
        newSpan.setAttribute('style', `color: ${getContrastYIQ(color)}; font-weight:bold; background-color: #${color}; padding-right: 2px; margin-right: 1px;`);
        content.replaceChild(newSpan, at);
      }
    });

    [].forEach.call(document.querySelectorAll('.emojify'), (content) => {
      content.innerHTML = emojify(content.innerHTML);
    });

    [].forEach.call(document.querySelectorAll('time.formatted'), (content) => {
      const datetime = new Date(content.getAttribute('datetime'));
      const formattedDate = dateTimeFormat.format(datetime);

      content.title = formattedDate;
      content.textContent = formattedDate;
    });

    [].forEach.call(document.querySelectorAll('time.time-ago'), (content) => {
      const datetime = new Date(content.getAttribute('datetime'));

      content.title = dateTimeFormat.format(datetime);
      content.textContent = relativeFormat.format(datetime);
    });

    [].forEach.call(document.querySelectorAll('.logo-button'), (content) => {
      content.addEventListener('click', (e) => {
        e.preventDefault();
        window.open(e.target.href, 'mastodon-intent', 'width=400,height=400,resizable=no,menubar=no,status=no,scrollbars=yes');
      });
    });

    [].forEach.call(document.querySelectorAll('[data-component="Video"]'), (content) => {
      const props = JSON.parse(content.getAttribute('data-props'));
      ReactDOM.render(<VideoContainer locale={locale} {...props} />, content);
    });

    [].forEach.call(document.querySelectorAll('[data-component="MediaGallery"]'), (content) => {
      const props = JSON.parse(content.getAttribute('data-props'));
      ReactDOM.render(<MediaGalleryContainer locale={locale} {...props} />, content);
    });

    [].forEach.call(document.querySelectorAll('[data-component="Card"]'), (content) => {
      const props = JSON.parse(content.getAttribute('data-props'));
      ReactDOM.render(<CardContainer locale={locale} {...props} />, content);
    });
  });

  delegate(document, '.webapp-btn', 'click', ({ target, button }) => {
    if (button !== 0) {
      return true;
    }
    window.location.href = target.href;
    return false;
  });

  delegate(document, '.status__content__fullwidth-spoiler', 'click', ({ target }) => {
    while (target.parentNode && target.className != 'status__content__fullwidth-spoiler')
      target = target.parentNode;

    const contentEl = target.parentNode.querySelector('.e-content');
    const iconEl = target.querySelector('.spoiler__icon');

    if (contentEl.style.display === 'block') {
      contentEl.style.display = 'none';
      iconEl.innerHTML = "<i class='fa fa-fw fa-angle-double-down'></i>";
    } else {
      contentEl.style.display = 'block';
      iconEl.innerHTML = "<i class='fa fa-fw fa-angle-double-up'></i>";
    }

    return false;
  });

  delegate(document, '.account_display_name', 'input', ({ target }) => {
    const nameCounter = document.querySelector('.name-counter');

    if (nameCounter) {
      nameCounter.textContent = 30 - length(target.value);
    }
  });

  delegate(document, '.account_note', 'input', ({ target }) => {
    const noteCounter = document.querySelector('.note-counter');

    if (noteCounter) {
      noteCounter.textContent = 160 - length(target.value);
    }
  });

  delegate(document, '#account_avatar', 'change', ({ target }) => {
    const avatar = document.querySelector('.card.compact .avatar img');
    const [file] = target.files || [];
    const url = file ? URL.createObjectURL(file) : avatar.dataset.originalSrc;

    avatar.src = url;
  });

  delegate(document, '#account_header', 'change', ({ target }) => {
    const header = document.querySelector('.card.compact');
    const [file] = target.files || [];
    const url = file ? URL.createObjectURL(file) : header.dataset.originalSrc;

    header.style.backgroundImage = `url(${url})`;
  });
}

loadPolyfills().then(main).catch(error => {
  console.error(error);
});
