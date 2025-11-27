export const dynamic = "force-dynamic";

export default function SettingsPage() {
  return (
    <div className="min-h-screen px-6 md:px-10 py-16 max-w-4xl mx-auto text-white">
      <h1 className="text-4xl font-bold mb-4">Settings</h1>
      <p className="text-gray-400 mb-10">
        Settings are not yet available. The first version will include account
        email, cloud backup, and deletion options.
      </p>

      <div className="space-y-6">
        <div className="p-6 rounded-xl border border-gray-700 bg-[#0F1A24]">
          <h2 className="text-xl font-semibold">Account email</h2>
          <p className="text-gray-400 text-sm mt-2">
            Changing your email will be available in a future update.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-gray-700 bg-[#0F1A24]">
          <h2 className="text-xl font-semibold">Cloud backup</h2>
          <p className="text-gray-400 text-sm mt-2">
            Encrypted cloud storage for your journal entries is planned for
            Havenly Premium.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-gray-700 bg-[#0F1A24]">
          <h2 className="text-xl font-semibold text-red-400">Delete account</h2>
          <p className="text-gray-400 text-sm mt-2">
            Account deletion will be enabled once full account management is
            implemented.
          </p>
        </div>
      </div>
    </div>
  );
}
