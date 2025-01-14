import Attendee from '../entities/attendee.js';

const getTemplate = (attendee = new Attendee()) => {
  const speakerIcon = attendee.isSpeaker
    ? `<img src="./../../assets/icons/asterisk.svg" alt="File icon" class="icon" />`
    : '';

  return `
  <div id="${attendee.id}" class="room-card__user">
    <div class="room-card__user__img">
      <img src="${attendee.img}" alt="${attendee.username}" />
    </div>
    <p class="room-card__user__name">
      ${speakerIcon}
      ${attendee.firstName}
    </p>
  </div>
  `;
};

export default getTemplate;
