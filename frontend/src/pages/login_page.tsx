import ButtonOne from '@/app/components/Button/ButtonOne';
import Link from 'next/link';
import styles from './styles/login_page.module.css';

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <h2>Login</h2>
        <input className={styles.input} type="text" placeholder="Username" />
        <input className={styles.input} type="password" placeholder="Password" />
        <ButtonOne width='100%'>Login</ButtonOne>
        <p>Not yet registerd!{' '}
        <Link href="/email_verification_page">
          Register
        </Link>{' '}
        to get started!
      </p>
      </div>
    </div>
  );
}
