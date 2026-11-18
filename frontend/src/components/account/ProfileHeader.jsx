
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

function ProfileHeader({ user }) {
  const name = user?.name || 'User';
  const email = user?.email || 'No email available';
  const initial = name.trim().charAt(0).toUpperCase();

  return (
    <section className="profile-summary-card">
      <div className="profile-avatar">
        {initial}
      </div>

      <h2>{name}</h2>

      <p className="profile-email">
        {email}
      </p>

      <span className="profile-member-since">
        Member since {formatMemberSince(user?.created_at)}
      </span>
    </section>
  );
}

export default ProfileHeader;
