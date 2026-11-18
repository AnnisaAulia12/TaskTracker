
function formatMemberSince(createdAt) {
  if (!createdAt) return 'Not available';

  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return 'Not available';
  }

  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

function AccountInformation({ user }) {
  return (
    <section className="account-information-section">
      <h2>Account Information</h2>

      <div className="account-information-card">
        <div className="account-information-row">
          <span>Full Name</span>
          <strong>{user?.name || 'Not available'}</strong>
        </div>

        <div className="account-information-row">
          <span>Email Address</span>
          <strong>{user?.email || 'Not available'}</strong>
        </div>

        <div className="account-information-row">
          <span>Member Since</span>
          <strong>{formatMemberSince(user?.created_at)}</strong>
        </div>
      </div>
    </section>
  );
}

export default AccountInformation;
