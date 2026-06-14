import { GalleryDateSection } from "../components/GalleryDateSection";
import { HomeBottomNav } from "../components/HomeBottomNav";
import { HomeHeader } from "../components/HomeHeader";
import { homeGalleryGroups } from "../data/mockHomeGallery";
import styles from "./HomeScreen.module.css";

export function HomeScreen() {
  return (
    <div className={styles.page}>
      <HomeHeader />
      <div className={styles.scroll}>
        {homeGalleryGroups.map((group, index) => (
          <GalleryDateSection
            key={group.id}
            group={group}
            showLayoutMenu={index === 0}
          />
        ))}
        <div className={styles.scrollEnd} aria-hidden />
      </div>
      <HomeBottomNav activeTab="home" />
    </div>
  );
}
