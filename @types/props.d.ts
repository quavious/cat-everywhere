export interface DefaultProps {
  lat: number;
  lng: number;
}

export interface PlaceProps extends DefaultProps {
  title: string;
  photo: string;
  placeId: string;
  icon: string;
}

export interface SelectedProps {
  clicked: boolean;
  photo: string;
  title: string;
}
