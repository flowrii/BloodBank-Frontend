export default function Home(){
    return (
        <div className="container">
            <div>
                <h1>Blood App</h1>
            </div>
            <div className="row">
                <div className="col-md-4">
                    <h2>Welcome to the Blood App!</h2>
                    <p>
                        Join our community by creating a new account or log in if you
                        already have one.
                    </p>
                </div>
                <div className="col-md-4">
                    <h2>Be a hero!</h2>
                    <p>
                        You were dreaming of becoming a hero since you were a child. Now is
                        your chance! You can save a life and become a hero by starting to
                        donate blood.
                    </p>
                </div>
                <div className="col-md-4">
                    <h2>Benefits</h2>
                    <p>
                        If you didn't know, there are a lot of benefits that come along with
                        the blood donation. Read more following the link below.
                    </p>
                    <p>
                        <a
                            className="btn btn-default"
                            href="https://healthmatters.nyp.org/the-surprising-benefits-of-donating-blood/"
                        >
                            Learn more &raquo;
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}