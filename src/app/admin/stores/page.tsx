import GoogleMapsProvider from "@/app/google-maps-provider";
import StoreListPage from "./component/store-list";

export default function StoreListWrapper() {
  return (
    <GoogleMapsProvider>
      <StoreListPage />
    </GoogleMapsProvider>
  );
}
