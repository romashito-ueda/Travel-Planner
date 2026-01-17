import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import BottomNav from "@/components/BottomNav";
import Overview from "@/pages/Overview";
import DayView from "@/pages/DayView";
import MapList from "@/pages/MapList";
import Checklist from "@/pages/Checklist";
import Sources from "@/pages/Sources";
import tripData from "@/data/trip.json";

function Router() {
  return (
    <Switch>
      <Route path="/">
        <Overview data={tripData} />
      </Route>
      <Route path="/schedule">
        <DayView data={tripData} />
      </Route>
      <Route path="/map">
        <MapList data={tripData} />
      </Route>
      <Route path="/checklist">
        <Checklist data={tripData} />
      </Route>
      <Route path="/sources">
        <Sources data={tripData} />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background text-foreground font-sans pb-24">
        <Router />
        <BottomNav />
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
