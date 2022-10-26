import {GetServerSideProps} from "next";
import {getCurrentUser, UserResponse} from "@/remoteAPI/users";
import {User} from "@/db/sequelize";

export const getServerSideProps: GetServerSideProps = async (context) => {
    const {
        res,
        req,
    } = context;

    try {
        console.log(context.params);
        const axiosResponseForCurrentUser = await getCurrentUser({
            headers: {
                Cookie: `authCookie=${req.cookies['authCookie']}; uuid=${req.cookies['uuid']}`,
            }
        });

        const userData = axiosResponseForCurrentUser.data;
        const userFromDB = await User.findOne({where: {id: userData.id}});

        return {
            props: {
                data: {theme: userFromDB?.theme},
            },
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
    theme: string;
};
