import Link from 'next/link';
import styles from './page.module.css'

export default function HomePage() {
  return (
    <div className={styles.main}>
      
      <h1>Welcome to Our Platform</h1>

      <p>
        <Link href="/login_page">
          Login
        </Link>{' '}
        or{' '}
        <Link href="/email_verification_page">
          Register
        </Link>{' '}
        to get started!
      </p>

    </div>
  );
}
