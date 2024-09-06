import { lazy, Suspense } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { Spinner, Header } from 'components';
import { Toaster } from 'sonner';

const DashboardPageV2 = lazy(() => import('pages/DashboardPageV2'));
const MsigMessagePage = lazy(() => import('pages/MsigMessagePage'));

const AboutPage = lazy(() => import('pages/AboutPage'));

const NotariesPage = lazy(() => import('pages/NotariesPage'));
const NotaryPage = lazy(() => import('pages/NotaryPage'));
const NotaryAllocationsOverview = lazy(() =>
  import('pages/NotaryAllocationsOverview')
);

const LargeDataSetsPage = lazy(() => import('pages/LargeDatasetsPage'));

const ClientsPage = lazy(() => import('pages/ClientsPage'));
const ClientPage = lazy(() => import('pages/ClientPage'));
const ClientBreakdownPage = lazy(() =>
  import('pages/ClientBreakdownPage')
);
const ClientAllocationPage = lazy(() =>
  import('pages/ClientAllocationPage')
);
const ClientDDODealsPage = lazy(() =>
  import('pages/ClientDDODealsPage')
);

const MinersPage = lazy(() => import('pages/MinersPage'));
const MinerPage = lazy(() => import('pages/MinerPage'));


const ComplianceDashboardPage = lazy(() => import('pages/ComplianceDashboardPage'));

function App() {
  return (
    <>
      <Header />
      <main>
        <Toaster position="top-right" toastOptions={{
          duration: 2000,
        }} />
        <Suspense
          fallback={
            <div style={{ margin: 'auto' }}>
              <Spinner width={40} height={40} />
            </div>
          }
        >
          <Switch>
            <Route exact path="/" component={DashboardPageV2} />
            <Route exact path="/about" component={AboutPage} />
            <Route exact path="/notaries" component={NotariesPage} />
            <Route exact path="/notaries/:notaryID" component={NotaryPage} />
            <Route
              exact
              path="/notaries/:notaryID/overview"
              component={NotaryAllocationsOverview}
            />
            <Route exact path="/large-datasets" component={LargeDataSetsPage} />
            <Route exact path="/clients" component={ClientsPage} />
            <Route exact path="/clients/:clientID" component={ClientPage} />
            <Route
              exact
              path="/clients/:clientID/breakdown"
              component={ClientBreakdownPage}
            />
            <Route
              exact
              path="/clients/:clientID/allocations"
              component={ClientAllocationPage}
            />
            <Route
              exact
              path="/compliance-data-portal"
              component={ComplianceDashboardPage}
            />
            <Route
              exact
              path="/clients/:clientID/ddo-deals"
              component={ClientDDODealsPage}
            />
            <Route exact path="/storage-providers" component={MinersPage} />
            <Route
              exact
              path="/storage-providers/:minerID"
              component={MinerPage}
            />
            <Route
              exact
              path="/msig-message/:msigCid"
              component={MsigMessagePage}
            />

            <Redirect to="/" />
          </Switch>
        </Suspense>
      </main>
    </>
  );
}

export default App;
