import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const usuarioScheme = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    token :{
       type : String
    },
    confirmado: {
        type: Boolean,
        default: false
    }
    
}, {
    timestamps: true
})

//middleware para hashear password si no hay cambio no hashea
usuarioScheme.pre('save', async function(next){
    const usuario = this;

    if(!usuario.isModified('password')){
        next()
    }

    const salt = await bcrypt.genSalt(10)
    usuario.password = await bcrypt.hash(usuario.password, salt);
})

usuarioScheme.methods.comprobarPassword = async function(passwordForm){
    return await bcrypt.compare(passwordForm, this.password)
}

const Usuario = mongoose.model("usuarios", usuarioScheme);

export default Usuario;