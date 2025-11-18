export function maskEmail(email) {
    const [user, domain] = email.split('@');
    if (!domain) return email;

    const visibleCount = 3;

    if (user.length <= visibleCount) return email;

    const visiblePart = user.substring(0, visibleCount);
    const hiddenLen = user.length - visibleCount;

    return visiblePart + '*'.repeat(hiddenLen) + '@' + domain;
}