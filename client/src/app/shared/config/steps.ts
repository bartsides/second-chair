import { Step } from '../models/step';

let Steps: Step[] = [
  {
    title: 'Cases',
    icon: 'gavel',
    route: '/cases',
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
];

export { Steps };
