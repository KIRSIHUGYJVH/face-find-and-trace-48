
import Dashboard from "../components/Dashboard";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Face Find & Trace</h1>
          <p className="text-sm opacity-90">Find lost persons by facial recognition</p>
        </div>
      </header>
      <main className="container mx-auto py-6 px-4">
        <Dashboard />
      </main>
      <footer className="bg-gray-100 py-6">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          &copy; {new Date().getFullYear()} Face Find & Trace. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
