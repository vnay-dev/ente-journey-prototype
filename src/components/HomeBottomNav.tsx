import { useLocation, useNavigate } from "react-router-dom";
import { usePrototypePaths } from "../hooks/usePrototypePaths";
import { NavBarIcon } from "./NavBarIcon";
import styles from "./HomeBottomNav.module.css";

type TabId = "home" | "albums" | "feed" | "search";

type Props = {
  activeTab?: TabId;
};

export function HomeBottomNav({ activeTab = "home" }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const paths = usePrototypePaths();

  const tabs: { id: TabId; label: string; path: string }[] = [
    { id: "home", label: "Home", path: paths.home },
    { id: "albums", label: "Albums", path: paths.albums },
    { id: "feed", label: "Feed", path: paths.home },
    { id: "search", label: "Search", path: paths.home },
  ];

  return (
    <nav className={styles.nav} aria-label="App navigation">
      <div className={styles.pill}>
        {tabs.map((tab) => {
          const active = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              className={`${styles.tab} ${active ? styles.tabActive : ""}`}
              aria-label={tab.label}
              aria-current={active ? "page" : undefined}
              onClick={() => {
                if (tab.path !== location.pathname) {
                  navigate(tab.path);
                }
              }}
            >
              <NavBarIcon tab={tab.id} filled={active && tab.id !== "search"} />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
