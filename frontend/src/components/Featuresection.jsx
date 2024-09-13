import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile ,faBook, faUserGroup, faLightbulb} from '@fortawesome/free-solid-svg-icons';

const features = [
  {
    name: 'Previour Year Papers',
    description:
      'Collection of previous year papers for various exams. Get access to the latest papers and prepare for your exams.',
    icon:faFile,
  },
  {
    name: 'Free Books',
    description:
      'A huge collection of free to read books. Get access to the latest books and prepare for your exams.',
    icon:faBook,
  },
  {
    name: 'Discussion Forum',
    description:
      'Stay in touch with your peers and get your doubts cleared. Join the discussion forum and get your queries resolved.',
      icon:faUserGroup,
  },
  {
    name: 'Expert Guidance',
    description:
      'Expert guidance and tips to help you prepare for your exams.',
    icon:faLightbulb,
  },
]

export default function Featuresection() {
  return (
    <div className="bg-white py-20 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Learn faster</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to prepare for your exams
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
          "Our resource hub platform offers a user-friendly interface with intuitive navigation, allowing users to easily explore a vast array of educational content. With powerful search functionality and personalized recommendations, users can quickly find relevant resources tailored to their interests and learning goals."
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                  <FontAwesomeIcon icon={feature.icon} className="h-6 w-6 text-white" aria-hidden="true"/>
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
