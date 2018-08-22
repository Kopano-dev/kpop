import React from 'react';

import KopanoIcon from './KopanoIcon';

import KopanoCalendarIcon from './KopanoCalendarIcon';
import KopanoContactsIcon from './KopanoContactsIcon';
import KopanoKonnectIcon from './KopanoKonnectIcon';
import KopanoMailIcon from './KopanoMailIcon';
import KopanoMeetIcon from './KopanoMeetIcon';
import KopanoWebappIcon from './KopanoWebappIcon';

function IconGallery() {
  return <React.Fragment>
    <KopanoIcon/>

    <br/>

    <KopanoCalendarIcon/>
    <KopanoContactsIcon/>
    <KopanoKonnectIcon/>
    <KopanoMailIcon/>
    <KopanoMeetIcon/>
    <KopanoWebappIcon/>
  </React.Fragment>;
}

export default IconGallery;
