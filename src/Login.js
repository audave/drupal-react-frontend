import React, { useState } from 'react';

function Login(props) {
    const [loading, setLoading] = useState(false);
    const username = useFormInput('');
    const password = useFormInput('');
    const [error, setError] = useState(null);
    // document.cookie = 'some:value';

    // handle button click of login form
    const handleLogin = () => {
        setError(null);  
        setLoading(true);
        // API something like http://example.com/user/login
        fetch('http://localhost:64076/user/login?_format=json',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: 'admin', pass: 'pass' }),
            }
        ).then(response => {
                const cookieHeader = response.headers.get('Set-Cookie');
                if (cookieHeader) {
                    // Parse cookie value from Set-Cookie header
                    const cookie = cookieHeader.split(';')[0];
                    console.log('Cookie:', cookie);
                    console.log(document.cookie);
                }
                console.log(document.cookie);
            return response.json();
        }
        )
            .then(result => {
                console.log(document.cookie);
                console.log(result);
            })

        // then(response => {
        //     // var data =  response.json();
        //     // console.log(data);
        //     // setLoading(false);
        //     console.log(response.json());
        //     // console.log(response.data);
        //     // console.log(response)
        //     // // set the token and user from the session storage
        //     // sessionStorage.setItem('token', response.data.token);
        //     // sessionStorage.setItem('user', JSON.stringify(response.data.user));
        //     // props.history.push('/dashboard');
        // }
        // )
            .catch(error => {
            setLoading(false);
            // if (error.response.status === 401) setError(error.response.data.message);
            // else setError("Something went wrong. Please try again later.");
        });
    }

    return (
        <div>
            Login<br /><br />
            <div>
                Username<br />
                <input type="text" {...username} autoComplete="new-password" />
            </div>
            <div style={{ marginTop: 10 }}>
                Password<br />
                <input type="password" {...password} autoComplete="new-password" />
            </div>
            {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}<br />
            <input type="button" value={loading ? 'Loading...' : 'Login'} onClick={handleLogin} disabled={loading} /><br />
        </div>
    );
}

const useFormInput = initialValue => {
    const [value, setValue] = useState(initialValue);

    const handleChange = e => {
        setValue(e.target.value);
    }
    return {
        value,
        onChange: handleChange
    }
}

export default Login;