import { useEffect } from 'react';
import { signin } from './apis/api-auth';

export default function App() {
  useEffect(() => {
    const controller = new AbortController();

    signin({
      name: 'john',
      email: 'john.doe@gmail.com',
      password: 'john_12345',
    })
      .then(data => console.log(data))
      .catch(err => console.log(err));

    // list(controller.signal)
    //   .then(data => console.log(data))
    //   .catch(err => console.log(err));

    return () => {
      controller.abort();
    };
  }, []);

  return <h1 className='text-3xl font-bold underline'>Hello world!</h1>;
}
