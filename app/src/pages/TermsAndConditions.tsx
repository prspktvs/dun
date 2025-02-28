import { DUN_EMAIL } from '../constants'
import { LandingHeader } from './LandingPage'
import Footer from './LandingPage/Footer'
import { RulerSeparator } from './LandingPage/RulerSeparator'

export default function TermsAndConditions() {
  return (
    <div className='h-screen w-full overflow-x-hidden scroll-smooth bg-[#faf9f6]'>
      <div className='m-2 border border-black'>
        <LandingHeader />
        <section className='font-monaspace px-40 text-[18px]'>
          <h1 className='text-center text-[80px] font-commissioner'>Terms & Policies</h1>
          <h2 className='text-center text-[28px]'>Terms of Use</h2>
          <p className='mb-12'>Last Updated: Feb 27, 2025 </p>
          <ul>
            <li>
              <p className='font-bold mt-12'>1. Introduction Welcome to Dun!</p>
              <p>
                These Terms and Conditions govern your use of Dun, a project management and team
                collaboration tool. By using Dun, you agree to comply with these Terms. If you do
                not agree, please do not use our service.
              </p>
            </li>
            <li>
              <p className='font-bold mt-12'>2. Use of the Service</p>
              <ul className='list-disc space-y-2'>
                <li>You must be at least 18 years old to use Dun.</li>
                <li>You are responsible for any content you create, upload, or share on Dun.</li>
                <li>
                  You agree not to use Dun for illegal activities, spamming, or distributing harmful
                  content.
                </li>
              </ul>
            </li>
            <li>
              <p className='font-bold mt-12'>3. Account and Security</p>
              <ul className='list-disc space-y-2'>
                <li>You are responsible for maintaining the security of your account.</li>
                <li>
                  Dun is not responsible for any loss or damage resulting from unauthorized access
                  to your account.
                </li>
              </ul>
            </li>
            <li>
              <p className='font-bold mt-12'>4. Intellectual Property</p>
              <ul className='list-disc space-y-2'>
                <li>
                  Dun owns all rights to its platform, including its name, logo, and software.
                </li>
                <li>
                  You retain ownership of the content you create but grant Dun a limited license to
                  display and store it for service functionality.
                </li>
              </ul>
            </li>
            <li>
              <p className='font-bold mt-12'>5. Limitation of Liability</p>
              <ul className='list-disc space-y-2'>
                <li>Dun is provided "as is" without warranties.</li>
                <li>
                  We are not liable for any losses, damages, or data loss caused by the use of Dun.
                </li>
              </ul>
            </li>
            <li>
              <p className='font-bold mt-12'>6. Termination</p>
              <ul className='list-disc'>
                <li>
                  We reserve the right to suspend or terminate your access if you violate these
                  Terms.
                </li>
                <li>You may stop using Dun at any time.</li>
              </ul>
            </li>
            <li>
              <p className='font-bold mt-12'>7. Changes to the Terms</p>
              <p>
                We may update these Terms from time to time. Continued use of Dun means you accept
                the revised Terms.
              </p>
            </li>
            <li>
              <p className='font-bold mt-12'>8. Contact Us</p>
              <p>
                For any questions, please contact us at{' '}
                <a
                  href={`mailto:${DUN_EMAIL}`}
                  target='_blank'
                  rel='noreferrer'
                  className='no-underline text-btnBg font-bold'
                >
                  {DUN_EMAIL}
                </a>
              </p>
            </li>
          </ul>
          <h2 className='text-center text-[28px] my-12'>Privacy Policy</h2>
          <p>Last Updated: Feb 27, 2025</p>
          <ul>
            <li>
              <p className='font-bold mt-12'>1. Introduction</p>
              <p>
                Welcome to Dun! This Privacy Policy explains how we collect, use, and protect your
                personal data when you use our platform. By using Dun, you agree to the practices
                outlined below.
              </p>
            </li>
            <li>
              <p className='font-bold mt-12'>2. Data We Collect</p>
              <p className='mb-2'>We may collect the following types of information:</p>
              <ul className='list-disc space-y-2'>
                <li>
                  Account Information: Name, email address, and other details you provide during
                  registration.
                </li>
                <li>
                  Usage Data: Information about how you use Dun, such as interactions with features.
                </li>
                <li>
                  Content Data: Any files, messages, or documents you upload or create within Dun.
                </li>
                <li>
                  Technical Data: IP address, browser type, and device information for security and
                  analytics purposes.
                </li>
              </ul>
            </li>
            <li>
              <p className='font-bold mt-12'>3. How We Use Your Data</p>{' '}
              <p className='mb-2'>We use the collected data to:</p>
              <ul className='list-disc space-y-2'>
                <li>Provide and improve Dun's features.</li>
                <li>Ensure account security and prevent fraud.</li>
                <li>Communicate updates, support, and service-related information.</li>
                <li>Analyze usage patterns to enhance user experience.</li>
              </ul>
            </li>
            <li>
              <p className='font-bold mt-12'>4. Data Sharing and Storage</p>
              <ul>
                <li>We do not sell your data to third parties.</li>
                <li>
                  We may use third-party services for hosting, analytics, or customer support.
                </li>
                <li>
                  Your data is stored securely, but no system is 100% secure—please use strong
                  passwords.
                </li>
              </ul>
            </li>
            <li>
              <p className='font-bold mt-12'>5. Cookies and Tracking</p>
              <p>
                We may use cookies and similar technologies to improve your experience. You can
                manage cookie settings in your browser.
              </p>
            </li>
            <li>
              <p className='font-bold mt-12'>6. Your Rights</p>
              <p className='mb-2'>You may have the right to:</p>
              <ul className='list-disc space-y-2'>
                <li>Access, update, or delete your personal data.</li>
                <li>Opt out of certain data collection practices.</li>
                <li>Request a copy of the data we hold about you.</li>
              </ul>
            </li>
            <li>
              <p className='font-bold mt-12'>7. Data Retention</p>
              <p>
                We retain your data as long as necessary to provide our services. If you delete your
                account, we will remove your data unless required by law.
              </p>
            </li>
            <li>
              <p className='font-bold mt-12'>8. Changes to This Policy</p>
              <p>
                We may update this Privacy Policy from time to time. Continued use of Dun means you
                accept the changes.
              </p>
            </li>
            <li>
              <p className='font-bold mt-12'>9. Contact Us</p>
              <p>
                If you have any questions, please contact us at{' '}
                <a
                  href={`mailto:${DUN_EMAIL}`}
                  target='_blank'
                  rel='noreferrer'
                  className='no-underline text-btnBg font-bold'
                >
                  {DUN_EMAIL}
                </a>
              </p>
            </li>
          </ul>
        </section>
        <RulerSeparator />
        <Footer />
      </div>
    </div>
  )
}
