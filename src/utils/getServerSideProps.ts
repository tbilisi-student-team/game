import {GetServerSideProps} from "next";
import {User} from "@/db/sequelize";
import {getToken} from "next-auth/jwt";

export const getServerSideProps: GetServerSideProps = async (context) => {
    const {
        res,
        req,
    } = context;
    try {
        const token = await getToken({ req });
        if (token && token.sub) {
            const userFromDB = await User.findOne({where: {id: token.sub}});
            return {
                props: {
                    theme: userFromDB?.theme,
                },
            }
        }
        return {
            props: {}
        }
    }
    catch (error) {
        return {
            props: {
                error
            }
        }
    }
}

export type GlobalServerSideProps = {
    theme: 'light' | 'dark';
};
