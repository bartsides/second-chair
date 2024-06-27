import { Step } from '../models/step';

let Steps: Step[] = [
  {
    title: 'Trial Details',
    icon: 'description',
    route: '/details',
  },
  {
    title: 'Jury Selection',
    icon: 'person_add',
    route: '/jury-selection',
  },
  {
    title: 'Jury Placement',
    icon: 'group',
    route: '/jury-placement',
  },
  {
    title: 'Evidence',
    icon: 'article',
    route: '/evidence',
  },
  {
    title: 'Messages',
    icon: 'mode_comment',
    route: '/messages',
  },
];

export { Steps };
