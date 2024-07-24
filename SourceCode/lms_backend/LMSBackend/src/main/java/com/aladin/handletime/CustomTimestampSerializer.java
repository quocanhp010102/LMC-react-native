package com.aladin.handletime;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

import java.io.IOException;
import java.sql.Timestamp;

public class CustomTimestampSerializer extends StdSerializer<Timestamp> {

    public CustomTimestampSerializer(){
        super(Timestamp.class);
    }

    protected CustomTimestampSerializer(JavaType type) {
        super(type);
    }

    protected CustomTimestampSerializer(Class<Timestamp> t) {
        super(t);
    }

    @Override
    public void serialize(Timestamp value, JsonGenerator gen, SerializerProvider provider) throws IOException {

    }
}
