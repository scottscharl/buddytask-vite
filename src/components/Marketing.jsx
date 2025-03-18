export default function Marketing() {
  return (
    <div className="flex flex-col items-center mx-auto space-y-4 ">
      <h1>BuddyTask -- Partner Accountability</h1>
      <div className="items-center space-x-2 ">
        <a href="/auth/login" className="px-3 py-2 border-gray-500 border-1">
          Log In
        </a>
        <a href="/auth/signup" className="px-3 py-2 bg-blue-500">
          Sign Up
        </a>
      </div>
    </div>
  );
}
