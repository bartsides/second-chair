export interface NavOption {
  title: string;
  icon: string;
  route: string;
}

var NavOptions: NavOption[] = [
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
];

export { NavOptions };
