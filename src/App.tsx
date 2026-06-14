import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { PhoneChrome } from "./components/PhoneChrome";
import { PhoneShell } from "./components/PhoneShell";
import { DemoGuideProvider } from "./context/DemoGuideContext";
import { ItineraryGenerationProvider } from "./context/ItineraryGenerationContext";
import { SharePreviewProvider } from "./context/SharePreviewContext";
import { V1Routes } from "./routes/v1";
import { V2Routes } from "./routes/v2";

export default function App() {
  return (
    <SharePreviewProvider>
      <BrowserRouter>
        <ItineraryGenerationProvider>
          <DemoGuideProvider>
            <PhoneShell>
              <PhoneChrome>
                <Routes>
                  <Route path="/" element={<Navigate to="/v2?demo=1" replace />} />
                  <Route path="/v1/*" element={<V1Routes />} />
                  <Route path="/v2/*" element={<V2Routes />} />
                </Routes>
              </PhoneChrome>
            </PhoneShell>
          </DemoGuideProvider>
        </ItineraryGenerationProvider>
      </BrowserRouter>
    </SharePreviewProvider>
  );
}
